//@/app/api/books/pages
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
/**
 * @swagger
 * /api/books/pages:
 *   patch:
 *     summary: Lesefortschritt und/oder Gesamtseitenzahl eines Buches aktualisieren
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: integer
 *               pagesRead:
 *                 type: integer
 *               totalPages:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Erfolgreich aktualisiert
 *       400:
 *         description: bookId fehlt
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function PATCH(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) { return response.NOTAUTHORIZED(); }
        const { bookId, pagesRead, totalPages } = await request.json();
        if (!bookId) {
            return NextResponse.json({ error: 'bookId fehlt.' }, { status: 400 });
        }
        // Update pagesRead in BookUser
        if (pagesRead !== undefined) {
            await prisma.bookUser.update({
                where: { userId_bookId: { userId, bookId: parseInt(bookId) } },
                                         data:  { pagesRead: parseInt(pagesRead) }
            });
        }
        // Update totalPages in Book
        if (totalPages !== undefined) {
            await prisma.book.update({
                where: { id: parseInt(bookId) },
                                     data:  { totalPages: parseInt(totalPages) }
            });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        return NextResponse.json({ error: "Serverfehler", message: error.message }, { status: 500 });
    }
}
