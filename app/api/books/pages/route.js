import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function PATCH(request) {
  try {
    const userId = 1; // Ersetze dies durch deine echte Auth-Logik
    const { bookId, pagesRead, totalPages } = await request.json();

    // 1. Gelesene Seiten aktualisieren und Session erstellen
    if (pagesRead !== undefined) {
      const newPagesRead = parseInt(pagesRead);

      // Alten Stand abrufen, um die Differenz zu berechnen
      const currentBookUser = await prisma.bookUser.findUnique({
        where: { userId_bookId: { userId, bookId } }
      });

      const previousPagesRead = currentBookUser?.pagesRead || 0;
      const pagesReadDelta = newPagesRead - previousPagesRead;

      // Haupt-Tabelle (BookUser) mit neuem Gesamtstand aktualisieren
      await prisma.bookUser.update({
        where: { userId_bookId: { userId, bookId } },
        data: { pagesRead: newPagesRead }
      });

      // Neue ReadingSession erstellen, falls tatsächlich weitergelesen wurde
      if (pagesReadDelta > 0) {
        await prisma.readingSession.create({
          data: {
            userId: userId,
            bookId: bookId,
            pagesRead: pagesReadDelta
            // 'date' wird durch @default(now()) in der schema.prisma automatisch gesetzt
          }
        });
      }
    }

    // 2. Gesamtseiten aktualisieren (Book Tabelle)
    if (totalPages !== undefined) {
      await prisma.book.update({
        where: { id: bookId },
        data: { totalPages: parseInt(totalPages) }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}