import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';


export async function GET() {
    try {
        if (!authorized('user')) return response.NOTAUTHORIZED;

        const db = await openDb();

        // BEGIN CLAUDE
        const rows = await db.prepare(`
        SELECT
        b.id, b.title, b.subtitle, b.description,
        b.isbn, b.pages, b.pub_year, b.picture,
        p.id AS publisher_id, p.name AS publisher_name,
        (
            SELECT JSON_GROUP_ARRAY(JSON_OBJECT('id', a.id, 'name', a.name))
            FROM authors a
            JOIN book_author ba ON a.id = ba.a_id
            WHERE ba.b_id = b.id
        ) AS authors,
        (
            SELECT JSON_GROUP_ARRAY(JSON_OBJECT('id', g.id, 'name', g.name))
            FROM genres g
            JOIN book_genres bg ON g.id = bg.g_id
            WHERE bg.b_id = b.id
        ) AS genres
        FROM books b
        LEFT JOIN publisher p ON b.publisher_id = p.id
        GROUP BY b.id
        `).all();

        const books = rows.map(b => ({
            id:          b.id,
            title:       b.title,
            subtitle:    b.subtitle,
            description: b.description,
            isbn:        b.isbn,
            pages:       b.pages,
            pub_year:    b.pub_year,
            picture:     b.picture,
            publisher:   b.publisher_id
            ? { id: b.publisher_id, name: b.publisher_name }
            : null,
            authors: JSON.parse(b.authors ?? '[]'),
                                     genres:  JSON.parse(b.genres  ?? '[]'),
        }));
        // END CLAUDE

        return NextResponse.json(books, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Daten', message: error.message },
            { status: 500 }
        );
    }
}

// BEGIN CLAUDE
export async function POST(request) {
    try {

        if (!authorized('user')) return response.NOTAUTHORIZED;

        const { title, subtitle, description, isbn, pages, pub_year, publisher_id, picture } = await request.json();

        if (!title) {
            return NextResponse.json(
                { error: 'Titel ist erforderlich' },
                { status: 400 }
            );
        }

        const db = await openDb();

        const result = db.prepare(
            `INSERT INTO books (title, subtitle, description, isbn, pages, pub_year, publisher_id, picture)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(title, subtitle ?? null, description ?? null, isbn ?? null, pages ?? null, pub_year ?? null, publisher_id ?? null, picture ?? null);

        const book = db.prepare(
            `SELECT b.id, b.title, b.subtitle, b.description, b.isbn, b.pages, b.pub_year, b.picture,
            p.id AS publisher_id, p.name AS publisher_name
            FROM books b
            LEFT JOIN publisher p ON b.publisher_id = p.id
            WHERE b.id = ?`
        ).get(result.lastInsertRowid);

        return NextResponse.json(
            {
                message: 'Buch erfolgreich angelegt',
                book: {
                    id:          book.id,
                    title:       book.title,
                    subtitle:    book.subtitle,
                    description: book.description,
                    isbn:        book.isbn,
                    pages:       book.pages,
                    pub_year:    book.pub_year,
                    picture:     book.picture,
                    publisher:   book.publisher_id
                    ? { id: book.publisher_id, name: book.publisher_name }
                    : null,
                    authors: [],
                    genres:  [],
                }
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
// END CLAUDE
