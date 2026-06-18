import { NextResponse } from 'next/server';
import * as argon2 from 'argon2';
import { openDb } from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';


export async function GET() {
    try {

        if (!authorized('admin')) {return response.NOTAUTHORIZED;}

        const db = await openDb();
        const users = await db.prepare('SELECT id, email, firstname, lastname, password FROM users').all(); // Passwort hier weglassen!

        return NextResponse.json(users, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Nutzerdaten',
              message: error.message
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {

        if (!authorized('admin')) {return response.NOTAUTHORIZED;}


        const { email, password, firstname } = await request.json();
        if (!email || !password || !firstname) {
            return NextResponse.json(
                { error: 'E-Mail, Passwort und Name sind erforderlich' },
                { status: 400 }
            );
        }

        const hash = await argon2.hash(password); // '+' für schnelle umwandlung in Int

        const db = await openDb();
        const result = db.prepare('INSERT INTO users (email, password, firstname) VALUES (?, ?, ?)').run(email, hash, firstname);

        return NextResponse.json(
            {
                message: 'Nutzer erfolgreich angelegt',
                id: result.lastID
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Fehler beim Erstellen des Nutzers',
                message: error.message
            },
            { status: 500 }
        );
    }
}
