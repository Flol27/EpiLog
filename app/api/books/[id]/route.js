import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';

// BEGIN CLAUDE
async function getBookById(db, id) {
    const book = db.prepare(`
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
    WHERE b.id = ?
    `).get(id);

    if (!book) return null;

    return {
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
        authors: JSON.parse(book.authors ?? '[]'),
        genres:  JSON.parse(book.genres  ?? '[]'),
    };
}
// END CLAUDE

export async function GET(request, { params }) {
    try {
        if (!authorized('user')) return response.NOTAUTHORIZED;

        const { id } = await params;
        const db = await openDb();

        const book = await getBookById(db, id);
        if (!book) return NextResponse.json({ error: 'Buch nicht gefunden', id }, { status: 404 });

        return NextResponse.json(book, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Daten', message: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        if (!authorized('user')) return response.NOTAUTHORIZED;

        const { id } = await params;
        const { title, subtitle, description, isbn, pages, pub_year, publisher_id, picture } = await request.json();

        const fields = [];
        const values = [];

        if (tools.checkName(title))        { fields.push('title = ?');        values.push(title); }
        if (tools.checkName(subtitle))     { fields.push('subtitle = ?');     values.push(subtitle); }
        if (tools.checkName(description))  { fields.push('description = ?');  values.push(description); }
        if (tools.checkISBN(isbn))         { fields.push('isbn = ?');         values.push(isbn); }
        if (tools.checkNum(pages))         { fields.push('pages = ?');        values.push(pages); }
        if (tools.checkYear(pub_year))     { fields.push('pub_year = ?');     values.push(pub_year); }
        if (publisher_id)                  { fields.push('publisher_id = ?'); values.push(publisher_id); }
        if (tools.checkPicture(picture))   { fields.push('picture = ?');      values.push(picture); }

        if (fields.length === 0) {
            return NextResponse.json({ error: 'Keine gültigen Felder zum Aktualisieren.' }, { status: 400 });
        }

        const db = await openDb();

        const result = db.prepare(`UPDATE books SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
        if (result.changes === 0) {
            return NextResponse.json({ error: 'Buch nicht gefunden.', id }, { status: 404 });
        }

        const book = await getBookById(db, id);

        return NextResponse.json(
            { message: 'Buch erfolgreich geändert', book },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Verändern des Buches', message: error.message },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    try {
        if (!authorized('user')) return response.NOTAUTHORIZED;

        const { id } = await params;
        const db = await openDb();

        const result = db.prepare('DELETE FROM books WHERE id = ?').run(id);
        if (result.changes === 0) {
            return NextResponse.json({ error: 'Buch nicht gefunden.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Buch gelöscht.' }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Löschen des Buches', message: error.message },
            { status: 500 }
        );
    }
}
