import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"; // Stelle sicher, dass der Pfad zu deiner Prisma-Instanz stimmt
// import { getSession } from '@/app/lib/auth'; // <-- Hier deine Auth-Methode importieren

export async function GET(request) {
  try {
    // 1. Finde heraus, welcher Nutzer gerade eingeloggt ist.
    // Wie genau das bei dir geht, hängt von app/lib/auth ab. 
    // Beispiel: const session = await getSession(request); const userId = session.userId;
    
    // Für diesen Code nehme ich an, wir haben die ID. (Zum Testen kannst du hier fest eine 1 eintragen)
    const userId = 1; 

    // 2. Lade den Nutzer und zähle gleichzeitig seine gespeicherten Bücher
    const user = await prisma.user.findUnique({
      where: { 
        id: userId 
      },
      select: {
        firstname: true,
        // Prisma bietet eine tolle Zählfunktion (_count) für Relationen:
        _count: {
          select: { bookUsers: true } 
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Nutzer nicht gefunden" }, { status: 404 });
    }

    // 3. Schicke die aufbereiteten Daten ans Frontend
    return NextResponse.json({
      firstname: user.firstname,
      bookCount: user._count.bookUsers
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Dashboard-Daten' },
      { status: 500 }
    );
  }
}