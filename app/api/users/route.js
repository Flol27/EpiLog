import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { openDb } from '@/app/lib/db';

export async function GET() {
    try {
        // 2. Cookie abfragen
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session_user_id');

        // 3. Wenn das Cookie nicht existiert -> Zugriff verweigern
        if (!sessionCookie) {
            return NextResponse.json(
                { error: 'Nicht autorisiert. Bitte zuerst einloggen.' },
                { status: 401 }
            );
        }

        // 4. Wenn das Cookie da ist -> Datenbank abfragen
        const db = await openDb();
        const users = await db.all('SELECT id, email FROM users'); // Passwort hier weglassen!

        return NextResponse.json(users, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Nutzerdaten' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        // 1. Daten aus dem Request auslesen

        console.log(request);

        const { email, password } = await request.json();

        console.log(email);

        if (!email || !password) {
            return NextResponse.json(
                { error: 'E-Mail und Passwort sind erforderlich' },
                { status: 400 }
            );
        }

        const db = await openDb();

        // 2. Passwort verschlüsseln (Salting & Hashing)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Nutzer in die SQLite-Datenbank einfügen
        const result = await db.run(
            'INSERT INTO users (email, password) VALUES (?, ?)',
                                    [email, hashedPassword]
        );

        // 4. Erfolgsmeldung zurückgeben
        return NextResponse.json(
            { message: 'Nutzer erfolgreich angelegt', id: result.lastID },
            { status: 201 }
        );

    } catch (error) {
        // Falls z.B. die E-Mail schon existiert (wenn Spalte UNIQUE ist)
        return NextResponse.json(
            { error: 'Fehler beim Erstellen des Nutzers',
              message: error.message
            },
            { status: 500 }
        );
    }
}
