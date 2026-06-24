import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';


export async function GET(request, { params }) {
    try {

        if (!authorized('user')) {return response.NOTAUTHORIZED;}

        const { id } = await params;
        const db = await openDb();
        const rows = await db.prepare(
            `SELECT DISTINCT
            b.id, b.title, a.id AS author_id, a.name AS author
            FROM books b
            LEFT JOIN book_author ba ON b.id = ba.b_id
            LEFT JOIN authors a ON ba.a_id = a.id
            WHERE b.id = ?`
        ).all(id);

        const book = {
            id: rows[0].id,
            title:rows[0].title,
            authors: rows.filter(row => row.author_id !== null).map(row => ({
                id:row.author_id,
                name:row.author
            }))
        };

        if(!book) return NextResponse.json({error:"Buch nicht gefunden", id:id}, {status:400});
        return NextResponse.json(book, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Daten',
                message: error.message
            },
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
    try {
        if (!authorized('user')) {return response.NOTAUTHORIZED;}

        const { id } = await params;
        const { author_id } = await request.json();

        if (!author_id) {
            return NextResponse.json({ error: 'ID fehlt.' }, { status: 400 });
        }

        const db = await openDb();

        const result = db.prepare('INSERT INTO book_author (b_id, a_id) VALUES (?, ?)').run(id, author_id);

        return NextResponse.json(
            {
                message: 'Autor erfolgreich hinzugefügt',
                id: result.lastInsertRowid,
            },
            { status: 201 }
        );
    }catch (error) {
        return NextResponse.json(
            {
                error: 'Fehler beim Hinzufügen des Autores',
                message: error.message
            },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    try {

        if (!authorized('user')) {return response.NOTAUTHORIZED;}

        const { id } = await params;
        const { author_id } = await request.json();

        if (!author_id) {
            return NextResponse.json({ error: 'ID fehlt.' }, { status: 400 });
        }

        const db = await openDb();
        const stmt = db.prepare('DELETE FROM book_author WHERE b_id = ? AND a_id = ?').run(id, author_id);

        if(stmt.changes < 1){return NextResponse.json({ error:"Buch oder Autor nicht gefunden"}, { status: 404 });}
        return NextResponse.json({message:"Autor entfernt"}, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Entfernen des Autores',
                message: error.message
            },
            { status: 500 }
        );
    }
}
