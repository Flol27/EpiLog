// @/app/api/dashboard-data/route.js
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth'; // Deine Auth-Methode

/**
 * @swagger
 * /api/dashboard-data:
 *   get:
 *     summary: Dashboard-Übersichtsdaten des eingeloggten Users abrufen (Buchanzahl, gelesene Seiten, Lese-Historie der letzten 6 Monate, zuletzt bearbeitetes Buch)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard-Daten erfolgreich abgerufen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstname:
 *                   type: string
 *                 bookCount:
 *                   type: integer
 *                   description: Anzahl der Bücher im Shelf des Users
 *                 totalPagesRead:
 *                   type: integer
 *                   description: Summe aller gelesenen Seiten über alle Bücher
 *                 sessions:
 *                   type: array
 *                   description: Lese-Sessions der letzten 6 Monate
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       pagesRead:
 *                         type: integer
 *                 lastBook:
 *                   type: object
 *                   nullable: true
 *                   description: Zuletzt bearbeitetes Buch (null, falls noch keins vorhanden)
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     pagesRead:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     coverKey:
 *                       type: string
 *                       nullable: true
 *                       description: Cover-Key von OpenLibrary, falls gefunden
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Nutzer nicht gefunden
 *       500:
 *         description: Serverfehler
 */
export async function GET(request) {
  try {
    // 1. Auth-Check
    const userId = await authorized('user', request);
    if (!userId) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }
    // Datum für 6 Monate in der Vergangenheit berechnen
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    // 2. Parallele Abfrage von User-Daten, letztem Buch, aggregierten Seiten UND Sessions
    const [user, lastBookEntry, pagesAggregate, sessions] = await prisma.$transaction([
      // Nutzerdaten und Buchanzahl
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstname: true,
          _count: { select: { bookUsers: true } }
        }
      }),
      // Zuletzt bearbeitetes Buch (via updatedAt)
      prisma.bookUser.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: {
          book: {
            select: {
              id: true,
              isbn: true, // WICHTIG: Hinzugefügt für den OpenLibrary-Fetch
              title: true,
              totalPages: true,
            }
          }
        }
      }),
      // Summe aller gelesenen Seiten (Pages Read) aggregieren
      prisma.bookUser.aggregate({
        where: { userId },
        _sum: { pagesRead: true }
      }),
      // NEU: Alle Sessions der letzten 6 Monate abrufen
      prisma.readingSession.findMany({
        where: {
          userId,
          date: { gte: sixMonthsAgo }
        },
        select: { date: true, pagesRead: true }
      })
    ]);
    // Prüfung muss nach der Abfrage stattfinden
    if (!user) {
      return NextResponse.json({ error: "Nutzer nicht gefunden" }, { status: 404 });
    }
    let bookDetails = null;
    if (lastBookEntry && lastBookEntry.book.isbn) {
      try {
        // Interner API-Aufruf an deine OpenLibrary-Route
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const olRes = await fetch(`${baseUrl}/api/openlibrary_search?q=${lastBookEntry.book.isbn}`);
        const olData = await olRes.json();
        if (olData.length > 0) {
          bookDetails = olData[0];
        }
      } catch (err) {
        console.error("Cover-Fetch fehlgeschlagen:", err);
      }
    }
    // Gesamtsumme der gelesenen Seiten sicherstellen (Fallback auf 0)
    const totalPagesRead = pagesAggregate._sum.pagesRead || 0;
    // 3. Ergebnis zusammenführen und zurückgeben
    return NextResponse.json({
      firstname: user.firstname,
      bookCount: user._count.bookUsers,
      totalPagesRead: totalPagesRead,
      sessions: sessions, // NEU: Array mit Historie ans Frontend senden
      lastBook: lastBookEntry ? {
        id: lastBookEntry.bookId,
        title: lastBookEntry.book.title,
        pagesRead: lastBookEntry.pagesRead,
        totalPages: lastBookEntry.book.totalPages,
        coverKey: bookDetails?.coverKey || null
      } : null
    });
  } catch (error) {
    console.error("Dashboard Data Error:", error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Dashboard-Daten', message: error.message },
      { status: 500 }
    );
  }
}
