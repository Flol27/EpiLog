import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';


export async function GET() {
    try {

        if (!authorized('user')) {return response.NOTAUTHORIZED;}

        const db = await openDb();
        const authors = await db.prepare('SELECT id, name FROM authors').all(); // Passwort hier weglassen!

        return NextResponse.json(authors, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Daten',
              message: error.message
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {

        if (!authorized('user')) {return response.NOTAUTHORIZED;}


        const { name } = await request.json();
        if (!name) {
            return NextResponse.json(
                { error: 'Name ist erforderlich' },
                { status: 400 }
            );
        }

        const db = await openDb();
        const result = db.prepare('INSERT INTO authors (name) VALUES (?)').run(name);

        const author = db.prepare('SELECT id, name FROM author WHERE id = ?').get(result.lastInsertRowid);

        return NextResponse.json(
            {
                message: 'Autor erfolgreich angelegt',
                id: result.lastInsertRowid,
                author
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Fehler beim Erstellen des Autors',
                message: error.message
            },
            { status: 500 }
        );
    }
}
