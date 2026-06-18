import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';


export async function GET() {
    try {

        if (!authorized('user')) {return response.NOTAUTHORIZED;}

        const db = await openDb();
        const books = await db.prepare(
            'SELECT b.id, title, subtitle, description, isbn, pages, pub_year, publisher_id, p.name AS publisher FROM books b LEFT JOIN publisher p ON b.publisher_id GROUP BY b.id'
        ).all();

        const books_formatted = books.map(b => ({
            title:b.title, subtitle:b.subtitle, description:b.description,
            isbn:b.isbn, pages:b.pages, pub_year:b.pub_year,
            publisher: b.publisher_id ? {id:b.publisher_id, name:b.publisher} : null}
        ));

        return NextResponse.json(books_formatted, { status: 200 });

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


        const { title, subtitle, description, isbn, pages, pub_year } = await request.json();
        if (!title) {
            return NextResponse.json(
                { error: 'E-Mail, Passwort und Name sind erforderlich' },
                { status: 400 }
            );
        }

        const db = await openDb();
        const result = db.prepare('INSERT INTO books (title, subtitle, description, isbn, pages, pub_year) VALUES (?, ?, ?, ?, ?, ?)').run(title, subtitle, description, isbn, pages, pub_year);

        const book = db.prepare('SELECT id, title, subtitle, description, isbn, pages, pub_year FROM books WHERE id = ?').get(result.lastInsertRowid);

        return NextResponse.json(
            {
                message: 'Buch erfolgreich angelegt',
                id: result.lastInsertRowid,
                book
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Fehler beim Erstellen des Buches',
                message: error.message
            },
            { status: 500 }
        );
    }
}
