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
        const genre = db.prepare('SELECT id, name FROM genres WHERE id = ?').get(id);

        if(!genre) return NextResponse.json({error:"Genre nicht gefunden", id:id}, {status:400});
        return NextResponse.json(genre, { status: 200 });

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

        const result = db.prepare(`UPDATE genres SET ${fields.join(", ")} WHERE id = ?`).run(...values, id);

        if(result.changes == 0) return NextResponse.json({error: 'Nicht gefunden.', id:id},{ status: 404 });

        const author = db.prepare('SELECT id, name FROM genres WHERE id = ?').get(id);

        return NextResponse.json(
            {
                message: 'Genre erfolgreich geändert',
                author
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Fehler beim Verändern des Genres',
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
        const stmt = db.prepare('DELETE FROM genres WHERE id = ?').run(id);

        if(stmt.changes < 1){return NextResponse.json({ error:"Genre nicht gefunden"}, { status: 400 });}
        return NextResponse.json({message:"Genre gelöscht"}, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Löschen des Genres',
                message: error.message
            },
            { status: 500 }
        );
    }
}
