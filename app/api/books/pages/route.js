import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';

export async function PATCH(request) {
    try {
        // 1. Auth-Check (aus HEAD)
        const userId = await authorized('user', request);
        if (!userId) { return response.NOTAUTHORIZED(); }

        const { bookId, pagesRead, totalPages } = await request.json();

        if (!bookId) {
            return NextResponse.json({ error: 'bookId fehlt.' }, { status: 400 });
        }

        const parsedBookId = parseInt(bookId);

        // 2. Gelesene Seiten aktualisieren und Session erstellen (aus DB)
        if (pagesRead !== undefined) {
            const newPagesRead = parseInt(pagesRead);

            // Alten Stand abrufen, um die Differenz zu berechnen
            const currentBookUser = await prisma.bookUser.findUnique({
                where: { userId_bookId: { userId, bookId: parsedBookId } }
            });

            const previousPagesRead = currentBookUser?.pagesRead || 0;
            const pagesReadDelta = newPagesRead - previousPagesRead;

            // Haupt-Tabelle (BookUser) mit neuem Gesamtstand aktualisieren
            await prisma.bookUser.update({
                where: { userId_bookId: { userId, bookId: parsedBookId } },
                data:  { pagesRead: newPagesRead }
            });

            // Neue ReadingSession erstellen, falls tatsächlich weitergelesen wurde
            if (pagesReadDelta > 0) {
                await prisma.readingSession.create({
                    data: {
                        userId: userId,
                        bookId: parsedBookId,
                        pagesRead: pagesReadDelta
                        // 'date' wird durch @default(now()) in der schema.prisma automatisch gesetzt
                    }
                });
            }
        }

        // 3. Update totalPages in Book (kombiniert)
        if (totalPages !== undefined) {
            await prisma.book.update({
                where: { id: parsedBookId },
                data:  { totalPages: parseInt(totalPages) }
            });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        return NextResponse.json({ error: "Serverfehler", message: error.message }, { status: 500 });
    }
}