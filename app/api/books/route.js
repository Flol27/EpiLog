import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';


export async function GET() {
    try {
        if (!authorized('user')) return response.NOTAUTHORIZED;

        const books = db.prepare('SELECT b.id, b.isbn, b.title FROM books b GROUP BY b.id').all();
        return NextResponse.json(books, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Daten', message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {

        if (!authorized('user')) return response.NOTAUTHORIZED;

        const { isbn, title} = await request.json();

        if (!isbn) {
            return NextResponse.json(
                { error: 'ISBN ist erforderlich' },
                { status: 400 }
            );
        }

        const result = db.prepare('INSERT INTO books (isbn, title) VALUES (?, ?)').run(isbn, title);

        const book = db.prepare('SELECT b.id, b.isbn, b.title FROM books b WHERE b.id = ?').get(result.lastInsertRowid);

        return NextResponse.json(
            {
                message: 'Buch erfolgreich angelegt',
                book
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Erstellen des Buches', message: error.message },
            { status: 500 }
        );
    }
}
