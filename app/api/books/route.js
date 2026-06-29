import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Alle Bücher des eingeloggten Users abrufen
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Liste aller Bücher des Users
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function GET(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) { return response.NOTAUTHORIZED(); }

        // Nur die Bücher des eingeloggten Users zurückgeben
        const bookUsers = await prisma.bookUser.findMany({
            where: { userId: userId },
            include: {
                book: {
                    select: {
                        id:    true,
                        isbn:  true,
                        title: true,
                    }
                }
            }
        });

        const books = bookUsers.map(bu => ({
            ...bu.book,
            pagesRead:  bu.pagesRead,
            startDate:  bu.startDate,
            readDate:   bu.readDate,
            rating:     bu.rating,
            ratingText: bu.ratingText,
        }));

        return NextResponse.json({ books }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Bücher', message: error.message },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Buch zum Shelf des Users hinzufügen
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isbn
 *             properties:
 *               isbn:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Buch zum Shelf hinzugefügt
 *       400:
 *         description: Ungültige Daten
 *       401:
 *         description: Nicht autorisiert
 *       409:
 *         description: Buch bereits im Shelf
 *       500:
 *         description: Serverfehler
 */
export async function POST(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) { return response.NOTAUTHORIZED(); }

        const { isbn, title } = await request.json();

        if (!isbn) {
            return NextResponse.json({ error: 'ISBN ist erforderlich' }, { status: 400 });
        }

        if (!tools.checkISBN(isbn)) return response.WRONGDATA("ISBN überprüfen", isbn);

        // Buch anlegen falls es noch nicht existiert (upsert)
        const book = await prisma.book.upsert({
            where:  { isbn },
            update: { title },
            create: { isbn, title },
        });

        // Prüfen ob der User das Buch bereits im Shelf hat
        const existing = await prisma.bookUser.findUnique({
            where: { userId_bookId: { userId, bookId: book.id } }
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Dieses Buch ist bereits in deinem Shelf.' },
                { status: 409 }
            );
        }

        // Verknüpfung User <-> Buch anlegen
        const bookUser = await prisma.bookUser.create({
            data: {
                userId,
                bookId: book.id,
            }
        });

        return NextResponse.json({ book, bookUser }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Hinzufügen des Buches', message: error.message },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/books:
 *   delete:
 *     summary: Buch aus dem Shelf des Users entfernen
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die Book-ID
 *     responses:
 *       200:
 *         description: Buch entfernt
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Buch nicht gefunden
 *       500:
 *         description: Serverfehler
 */
export async function DELETE(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) { return response.NOTAUTHORIZED(); }

        const { searchParams } = new URL(request.url);
        const bookId = parseInt(searchParams.get('id'));

        if (!bookId) {
            return NextResponse.json({ error: 'Book-ID fehlt' }, { status: 400 });
        }

        // Nur die BookUser-Verknüpfung löschen, nicht das Buch selbst
        const deleted = await prisma.bookUser.deleteMany({
            where: { userId, bookId }
        });

        if (deleted.count === 0) {
            return NextResponse.json(
                { error: 'Buch nicht in deinem Shelf gefunden.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Buch aus Shelf entfernt.' }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Löschen des Buches', message: error.message },
            { status: 500 }
        );
    }
}
