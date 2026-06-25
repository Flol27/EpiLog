import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(request, { params }) {
    try {
        if (!authorized('user')) return response.NOTAUTHORIZED;

        const { id } = await params;

        const book = db.prepare('SELECT b.id, b.isbn, b.title FROM books b GROUP BY b.id WHERE b.id = ?').get(id);

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
        const { isbn, title } = await request.json();

        const fields = [];
        const values = [];

        if (tools.checkName(isbn))     { fields.push('isbn = ?');     values.push(isbn); }
        if (tools.checkName(title))        { fields.push('title = ?');        values.push(title); }

        if (fields.length === 0) {
            return NextResponse.json({ error: 'Keine gültigen Felder zum Aktualisieren.' }, { status: 400 });
        }

        const result = db.prepare(`UPDATE books SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
        if (result.changes === 0) {
            return NextResponse.json({ error: 'Buch nicht gefunden.', id }, { status: 404 });
        }

        const book = db.prepare('SELECT b.id, b.isbn, b.title FROM books b WHERE b.id = ?').get(id);

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
