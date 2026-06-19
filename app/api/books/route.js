import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';


export async function GET() {
    try {

        if (!authorized('user')) {return response.NOTAUTHORIZED;}

        const db = await openDb();
//         const books = await db.prepare(
//             'SELECT b.id, title, subtitle, description, isbn, pages, pub_year, publisher_id, p.name AS publisher FROM books b LEFT JOIN publisher p ON b.publisher_id GROUP BY b.id'
//         ).all();
//
        const books = await db.prepare(
            `SELECT
            b.id, b.title, b.subtitle, b.description, b.isbn, b.pages, b.pub_year, b.picture,
            p.name AS publisher, a.name AS author, g.name AS genre
            FROM books b
            LEFT JOIN publisher p ON b.publisher_id
            LEFT JOIN book_author ba ON b.id = ba.b_id
            LEFT JOIN authors a ON ba.a_id = a.id
            LEFT JOIN book_genres ga ON b.id = ga.b_id
            LEFT JOIN genres g ON ga.g_id = g.id`
        ).all();

        const books_formatted = books.map(b => ({
            title:b.title, subtitle:b.subtitle, description:b.description,
            isbn:b.isbn, pages:b.pages, pub_year:b.pub_year,
            publisher: b.publisher_id ? {id:b.publisher_id, name:b.publisher} : null}
        ));

        return NextResponse.json(books, { status: 200 });

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


        const { title, subtitle, description, isbn, pages, pub_year, publisher_id, picture/*, author_id, genre_id*/ } = await request.json();
        if (!title) {
            return NextResponse.json(
                { error: 'E-Mail, Passwort und Name sind erforderlich' },
                { status: 400 }
            );
        }

        const db = await openDb();

        /*
        const a_result = db.prepare('SELECT id, name FROM authors WHERE id = ?').get(author_id);
        const g_result = db.prepare('SELECT id, name FROM genres WHERE id = ?').get(genre_id);

        if(a_result === undefined || g_result === undefined) return NextResponse.json({error:"Not found Author or Genre", author:a_result?a_result:null, genre:g_result?g_result:null},{status:404});
        */

        const result = db.prepare('INSERT INTO books (title, subtitle, description, isbn, pages, pub_year, publisher_id, picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(title, subtitle, description, isbn, pages, pub_year, publisher_id, picture);

        /*
        const ab_result = db.prepare('INSERT INTO book_author (b_id, a_id) VALUES (?, ?)').run(result.lastInsertRowid, author_id);
        const gb_result = db.prepare('INSERT INTO book_genres (b_id, g_id) VALUES (?, ?)').run(result.lastInsertRowid, genre_id);
        */

        const book = db.prepare('SELECT id, title, subtitle, description, isbn, pages, pub_year, publisher_id, picture FROM books WHERE id = ?').get(result.lastInsertRowid);

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
