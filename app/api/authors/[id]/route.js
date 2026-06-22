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
        const author = db.prepare('SELECT id, name FROM authors WHERE id = ?').get(id);

        if(!author) return NextResponse.json({error:"Autor nicht gefunden", id:id}, {status:400});
        return NextResponse.json(author, { status: 200 });

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
        const { name } = await request.json();

        let fields = [];
        let values = [];

        // Check fields
        if(name){fields.push("name = ?");values.push(name);}

        if(fields.length === 0) return NextResponse.json({error: 'Keine Daten, oder nicht genug Rechte.'},{ status: 400 });

        const db = await openDb();

        const result = db.prepare(`UPDATE authors SET ${fields.join(", ")} WHERE id = ?`).run(...values, id);

        if(result.changes == 0) return NextResponse.json({error: 'Nicht gefunden.', id:id},{ status: 404 });

        const author = db.prepare('SELECT id, name FROM authors WHERE id = ?').get(id);

        return NextResponse.json(
            {
                message: 'Autor erfolgreich geändert',
                author
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Fehler beim Verändern des Autors',
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
        const stmt = db.prepare('DELETE FROM authors WHERE id = ?').run(id);

        if(stmt.changes < 1){return NextResponse.json({ error:"Autor nicht gefunden"}, { status: 400 });}
        return NextResponse.json({message:"Autor gelöscht"}, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Löschen des Autors',
                message: error.message
            },
            { status: 500 }
        );
    }
}
