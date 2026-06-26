import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(request, { params }) {
    try {
        if (!authorized('user')) return response.NOTAUTHORIZED;

        const { id } = await params;

        const user = db.prepare('SELECT u.id, u.username FROM users u WHERE u.id = ?').get(id);
        if(!user) return NextResponse.json({ error: 'User nicht gefunden', id }, { status: 404 });

        const books = db.prepare('SELECT b.id, b.isbn, b.title FROM book_user LEFT JOIN books b ON b_id=b.id WHERE u_id = ?').all(id);
        if (!books) return NextResponse.json({ error: 'Keine Bücher', u_id:id }, { status: 404 });

        return NextResponse.json({user:user, books:books}, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Daten', message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
    try {

        if (!authorized('user')) return response.NOTAUTHORIZED;

        const { id } = await params;
        const u_id = parseInt(id, 10);
        const { b_id } = await request.json();

        if (!u_id || !b_id) {
            return NextResponse.json(
                { error: 'User-ID und Buch-ID sind erforderlich' },
                { status: 400 }
            );
        }

        if(db.prepare('SELECT * FROM book_user WHERE u_id = ? AND b_id = ?').get(u_id, b_id)){
            return NextResponse.json(
                { error: 'Schon hinzugefügt', u_id:u_id, b_id:b_id},
                { status: 409 }
            );
        }

        const result = db.prepare('INSERT INTO book_user (u_id, b_id) VALUES (?, ?)').run(u_id, b_id);

        const book = db.prepare('SELECT b.id, b.isbn, b.title FROM books b WHERE b.id = ?').get(b_id);

        return NextResponse.json(
            {
                message: 'Buch erfolgreich hinzugefügt',
                book
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Hinzufügen des Buches', message: error.message },
            { status: 500 }
        );
    }
}
