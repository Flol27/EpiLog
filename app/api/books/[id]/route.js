import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(request, { params }) {
    try {

        if (!authorized('user')) {return response.NOTAUTHORIZED;}

        const { id } = await params;
        const db = await openDb();
        const book = db.prepare('SELECT b.id, title, subtitle, description, isbn, pages, pub_year, publisher_id FROM books b, publisher p WHERE b.id = p.id AND b.id = ?').get(id);

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

export async function PUT(request, { params }) {
    try {

        if (!authorized('user')) {return response.NOTAUTHORIZED;}

        const { id } = await params;
        const { title, subtitle, description, isbn, pages, pub_year, publisher_id, picture, author_id, genre_id } = await request.json();

        let fields = [];
        let values = [];

        // Check fields
        if(tools.checkName(title)){fields.push("title = ?");values.push(title);}
        if(tools.checkName(subtitle)){fields.push("subtitle = ?");values.push(subtitle);}
        if(tools.checkName(description)){fields.push("description = ?");values.push(description);}
        if(tools.checkISBN(isbn)){fields.push("isbn = ?");values.push(isbn);}
        if(tools.checkNum(pages)){fields.push("pages = ?");values.push(pages);}
        if(tools.checkYear(pub_year)){fields.push("pub_year = ?");values.push(pub_year);}
        if(publisher_id){fields.push("publisher_id = ?");values.push(publisher_id);}
        if(picture){fields.push("picture = ?");values.push(picture);}


        if(fields.length === 0) return NextResponse.json({error: 'Keine Daten, oder nicht genug Rechte.'},{ status: 400 });

        const db = await openDb();

        const result = db.prepare(`UPDATE books SET ${fields.join(", ")} WHERE id = ?`).run(...values, id);

        if(result.changes == 0) return NextResponse.json({error: 'Nicht gefunden.', id:id},{ status: 404 });

        const book = db.prepare('SELECT id, title FROM books WHERE id = ?').get(id);

        return NextResponse.json(
            {
                message: 'Buch erfolgreich geändert',
                book
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Fehler beim Verändern des Buches',
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
        const db = await openDb();
        const stmt = db.prepare('DELETE FROM books WHERE id = ?').run(id);

        if(stmt.changes < 1){return NextResponse.json({ error:"Buch nicht gefunden"}, { status: 400 });}
        return NextResponse.json({message:"Buch gelöscht"}, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Löschen des Buches',
                message: error.message
            },
            { status: 500 }
        );
    }
}
