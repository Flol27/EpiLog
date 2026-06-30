//@/app/api/rewiews
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Eigene Review + Reviews von Freunden für ein Buch abrufen
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: query
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: ISBN des Buches
 *     responses:
 *       200:
 *         description: Eigene Review und Freundes-Reviews
 *       400:
 *         description: ISBN fehlt
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function GET(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) return response.NOTAUTHORIZED();
        const { searchParams } = new URL(request.url);
        const isbn = searchParams.get('isbn');
        if (!isbn) return NextResponse.json({ error: 'ISBN fehlt.' }, { status: 400 });
        const book = await prisma.book.findUnique({ where: { isbn } });
        if (!book) return NextResponse.json({ ownReview: null, friendReviews: [] }, { status: 200 });
        // Own review
        const ownReview = await prisma.review.findUnique({
            where: { userId_bookId: { userId, bookId: book.id } },
            include: { user: { select: { firstname: true, lastname: true, username: true, profilePic: true } } }
        });
        // Friend IDs
        const friendships = await prisma.friendship.findMany({
            where: { OR: [{ fromId: userId }, { toId: userId }] }
        });
        const friendIds = friendships.map(f => f.fromId === userId ? f.toId : f.fromId);
        // Reviews from friends
        const friendReviews = await prisma.review.findMany({
            where: { bookId: book.id, userId: { in: friendIds } },
            include: { user: { select: { firstname: true, lastname: true, username: true, profilePic: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ ownReview, friendReviews }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Eigene Review erstellen oder aktualisieren
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isbn
 *               - rating
 *             properties:
 *               isbn:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review erfolgreich erstellt/aktualisiert
 *       400:
 *         description: Pflichtfelder fehlen oder Rating ungültig
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function POST(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) return response.NOTAUTHORIZED();
        const { isbn, rating, text } = await request.json();
        if (!isbn || !rating) return NextResponse.json({ error: 'ISBN und Rating sind erforderlich.' }, { status: 400 });
        if (rating < 1 || rating > 5) return NextResponse.json({ error: 'Rating muss zwischen 1 und 5 liegen.' }, { status: 400 });
        // Upsert book
        const book = await prisma.book.upsert({
            where: { isbn },
            update: {},
            create: { isbn },
        });
        // Upsert review
        const review = await prisma.review.upsert({
            where: { userId_bookId: { userId, bookId: book.id } },
            update: { rating, text: text || null, updatedAt: new Date() },
                                                  create: { userId, bookId: book.id, rating, text: text || null },
        });
        return NextResponse.json({ review }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/reviews:
 *   delete:
 *     summary: Eigene Review für ein Buch löschen
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: query
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: ISBN des Buches
 *     responses:
 *       200:
 *         description: Review erfolgreich gelöscht
 *       400:
 *         description: ISBN fehlt
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
        if (!userId) return response.NOTAUTHORIZED();
        const { searchParams } = new URL(request.url);
        const isbn = searchParams.get('isbn');
        if (!isbn) return NextResponse.json({ error: 'ISBN fehlt.' }, { status: 400 });
        const book = await prisma.book.findUnique({ where: { isbn } });
        if (!book) return NextResponse.json({ error: 'Buch nicht gefunden.' }, { status: 404 });
        await prisma.review.deleteMany({ where: { userId, bookId: book.id } });
        return NextResponse.json({ message: 'Review gelöscht.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
