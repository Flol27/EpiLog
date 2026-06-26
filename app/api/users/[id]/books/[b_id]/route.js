import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(request, { params }) {
    try {
        if (!authorized('user')) return response.NOTAUTHORIZED;

        const { id, b_id } = await params;

        const user = db.prepare('SELECT u.id, u.username FROM users u WHERE u.id = ?').get(id);
        if(!user) return NextResponse.json({ description: 'User nicht gefunden', id }, { status: 404 });

        const book = db.prepare('SELECT * FROM book_user LEFT JOIN books b ON b_id=b.id WHERE u_id = ? AND b_id = ?').get(id, b_id);
        if (!book) return NextResponse.json({ description: 'Keine Bücher', u_id:id }, { status: 404 });

        return NextResponse.json({user:user, book:book}, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { description: 'Fehler beim Abrufen der Daten', error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {

        if (!authorized('user')) return response.NOTAUTHORIZED;

        const { id, b_id } = await params;

        const { pages_read, readstreak_edit_date, start_date, read_date, rating, rating_text } = await request.json();

        let fields = [];
        let values = [];

        // Check fields
        if (tools.checkNum(pages_read))             { fields.push('pages_read = ?');            values.push(pages_read); }
        if (tools.checkDate(readstreak_edit_date))  { fields.push('readstreak_edit_date = ?');  values.push(readstreak_edit_date); }
        if (tools.checkDate(start_date))            { fields.push('start_date = ?');            values.push(start_date); }
        if (tools.checkDate(read_date))             { fields.push('read_date = ?');             values.push(read_date); }
        if (tools.checkNum(rating))                 { fields.push('rating = ?');                values.push(rating); }
        if (tools.checkText(rating_text))           { fields.push('rating_text = ?');           values.push(rating_text); }

        if(fields.length === 0) return NextResponse.json({error: 'Keine Daten, oder nicht genug Rechte.'},{ status: 400 });

        const result = db.prepare(`UPDATE book_user SET ${fields.join(", ")} WHERE u_id = ? AND b_id = ?`).run(...values, id, b_id);

        if(result.changes == 0) return NextResponse.json({error: 'Nicht gefunden.', id:id},{ status: 404 });

        const book = db.prepare('SELECT * FROM book_user LEFT JOIN books b ON b_id=b.id WHERE u_id = ? AND b_id = ?').get(id, b_id);

        return NextResponse.json(
            {
                description: 'Daten erfolgreich geändert',
                book:book
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { description: 'Fehler beim Hinzufügen des Buches', error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        if (!authorized('user')) return response.NOTAUTHORIZED;

        const { id, b_id } = await params;

        const result = db.prepare('DELETE FROM book_user WHERE u_id = ? AND b_id = ?').run(id, b_id);
        if (result.changes === 0) {
            return NextResponse.json({ description: 'Buch oder User nicht gefunden.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Buch entfernt.' }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { description: 'Fehler beim Abrufen der Daten', error: error.message },
            { status: 500 }
        );
    }
}
