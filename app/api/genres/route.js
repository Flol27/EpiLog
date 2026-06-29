import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';


export async function GET() {
    try {

        if (!authorized('user')) {return response.NOTAUTHORIZED;}

        const db = await openDb();
        const authors = await db.prepare('SELECT id, name FROM genres').all(); // Passwort hier weglassen!

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
        const result = db.prepare('INSERT INTO genres (name) VALUES (?)').run(name);

        const genre = db.prepare('SELECT id, name FROM genres WHERE id = ?').get(result.lastInsertRowid);


        return NextResponse.json(
            {
                message: 'Genre erfolgreich angelegt',
                id: result.lastInsertRowid,
                genre
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Fehler beim Erstellen des Genres',
                message: error.message
            },
            { status: 500 }
        );
    }
}
