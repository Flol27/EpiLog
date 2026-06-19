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
            b.id, b.title, g.id AS genre_id, g.name AS genre
            FROM books b
            LEFT JOIN book_genres ga ON b.id = ga.b_id
            LEFT JOIN genres g ON ga.g_id = g.id
            WHERE b.id = ?`
        ).all(id);

        console.log(rows);

        const book = {
            id: rows[0].id,
            title:rows[0].title,
            genres: rows.filter(row => row.genre_id !== null).map(row => ({
                id:row.genre_id,
                name:row.genre
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
        const { genre_id } = await request.json();
        const db = await openDb();

        const result = db.prepare('INSERT INTO book_genres (b_id, g_id) VALUES (?, ?)').run(id, genre_id);

        return NextResponse.json(
            {
                message: 'Genre erfolgreich hinzugefügt',
                id: result.lastInsertRowid,
            },
            { status: 201 }
        );
    }catch (error) {
        return NextResponse.json(
            {
                error: 'Fehler beim Hinzufügen des Genres',
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
        const { genre_id } = await request.json();
        const db = await openDb();
        const stmt = db.prepare('DELETE FROM book_genres WHERE b_id = ? AND g_id = ?').run(id, genre_id);

        if(stmt.changes < 1){return NextResponse.json({ error:"Buch oder Genre nicht gefunden"}, { status: 404 });}
        return NextResponse.json({message:"Genre entfernt"}, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Entfernen des Genres',
                message: error.message
            },
            { status: 500 }
        );
    }
}
