import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { openDb } from '@/app/lib/db';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Bitte alle Felder ausfüllen' }, { status: 400 });
        }

        const db = await openDb();

        // 1. Nutzer anhand der E-Mail in SQLite suchen
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        // Sicherheits-Tipp: Bei falscher E-Mail die gleiche Fehlermeldung wie bei falschem Passwort
        if (!user) {
            return NextResponse.json({ error: 'E-Mail oder Passwort falsch' }, { status: 401 });
        }

        // 2. Passwort mit dem Hash aus der Datenbank vergleichen
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ error: 'E-Mail oder Passwort falsch' }, { status: 401 });
        }

        // 3. Session-Cookie erstellen (HTTP-only)
        const cookieStore = await cookies();
        cookieStore.set('session_user_id', user.id.toString(), {
            httpOnly: true, // Schützt vor JavaScript-Auslesung (XSS)
            secure: process.env.NODE_ENV === 'production', // Nur über HTTPS im Live-Betrieb
            path: '/',
            maxAge: 60 * 60 * 24, // Cookie gültig für 1 Tag (in Sekunden)
        });

        return NextResponse.json({ message: 'Login erfolgreich!' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Fehler beim Server-Login' }, { status: 500 });
    }
}
