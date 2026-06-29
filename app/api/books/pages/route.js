import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function PATCH(request) {
  try {
    const userId = 1; // Ersetze dies durch deine echte Auth-Logik
    const { bookId, pagesRead, totalPages } = await request.json();

    // 1. Gelesene Seiten aktualisieren (BookUser Tabelle)
    if (pagesRead !== undefined) {
      await prisma.bookUser.update({
        where: { userId_bookId: { userId, bookId } },
        data: { pagesRead: parseInt(pagesRead) }
      });
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