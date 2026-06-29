import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';

export async function GET(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) { return response.NOTAUTHORIZED(); }

        const bookUsers = await prisma.bookUser.findMany({
            where: { userId },
            include: {
                book: {
                    select: {
                        id:         true,
                        isbn:       true,
                        title:      true,
                        totalPages: true,
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
            updatedAt:  bu.updatedAt,
        }));

        return NextResponse.json({ books }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Fehler beim Abrufen', message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) { return response.NOTAUTHORIZED(); }

        const { isbn, title } = await request.json();

        if (!isbn) return NextResponse.json({ error: 'ISBN ist erforderlich' }, { status: 400 });
        if (!tools.checkISBN(isbn)) return response.WRONGDATA("ISBN überprüfen", isbn);

        const book = await prisma.book.upsert({
            where:  { isbn },
            update: { title },
            create: { isbn, title },
        });

        const existing = await prisma.bookUser.findUnique({
            where: { userId_bookId: { userId, bookId: book.id } }
        });

        if (existing) {
            return NextResponse.json({ error: 'Dieses Buch ist bereits in deinem Shelf.' }, { status: 409 });
        }

        const bookUser = await prisma.bookUser.create({
            data: { userId, bookId: book.id }
        });

        return NextResponse.json({ book, bookUser }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: 'Fehler beim Hinzufügen', message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) { return response.NOTAUTHORIZED(); }

        const { searchParams } = new URL(request.url);
        const bookId = parseInt(searchParams.get('id'));

        if (!bookId) return NextResponse.json({ error: 'Book-ID fehlt' }, { status: 400 });

        const deleted = await prisma.bookUser.deleteMany({ where: { userId, bookId } });

        if (deleted.count === 0) {
            return NextResponse.json({ error: 'Buch nicht gefunden.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Buch aus Shelf entfernt.' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Fehler beim Löschen', message: error.message }, { status: 500 });
    }
}
