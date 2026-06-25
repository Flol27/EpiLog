import { NextResponse } from 'next/server';
import * as argon2 from 'argon2';
import db from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';


export async function GET() {
    try {

        if (!authorized('admin')) {return response.NOTAUTHORIZED;}

        const users = db.prepare('SELECT id, email, username, firstname, lastname FROM users').all(); // Passwort hier weglassen!

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

        // Jeder kann User anlegen - if (!authorized('admin')) {return response.NOTAUTHORIZED;}

        const { email, username, password, firstname, lastname } = await request.json();
        if (!email || !username || !password || !firstname) {
            return NextResponse.json(
                { error: 'E-Mail, Username, Passwort und Name sind erforderlich' },
                { status: 400 }
            );
        }

        const hash = await argon2.hash(password);

        const result = db.prepare('INSERT INTO users (email, username, password, firstname, lastname) VALUES (?, ?, ?, ?, ?)').run(email, username, hash, firstname, lastname);

        const user = db.prepare('SELECT id, email, username, firstname, lastname FROM users WHERE id = ?').get(result.lastInsertRowid);

        return NextResponse.json(
            {
                message: 'Nutzer erfolgreich angelegt',
                id: result.lastInsertRowid,
                user
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
