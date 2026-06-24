import { NextResponse } from 'next/server';
import * as argon2 from 'argon2';
import { openDb } from '@/app/lib/db';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(request, { params }) {
    try {

        if (!authorized('admin')) {return response.NOTAUTHORIZED;}

        const { id } = await params;
        const db = await openDb();
        const user = db.prepare('SELECT id, email, firstname, lastname FROM users WHERE id = ?').get(id);

        if(!user) return NextResponse.json({error:"User nicht gefunden", id:id}, {status:400});
        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Nutzerdaten',
                message: error.message
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {

        let admin = false;

        if (authorized('admin')) {admin = true;}
        else if (authorized('user')) {admin = false;}
        else {return response.NOTAUTHORIZED;}

        const { id } = await params;
        const { email, password, firstname, lastname, role } = await request.json();

        let fields = [];
        let values = [];

        // Check fields
        if(email){fields.push("email = ?");values.push(email);}
        if(password){fields.push("password = ?");values.push(await argon2.hash(password));}
        if(firstname){fields.push("firstname = ?");values.push(firstname);}
        if(lastname){fields.push("lastname = ?");values.push(lastname);}
        if(role){if(admin){fields.push("role = ?");values.push(role);}}

        if(fields.length === 0) return NextResponse.json({error: 'Keine Daten, oder nicht genug Rechte.'},{ status: 400 });

        const db = await openDb();

        const result = db.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`).run(...values, id);

        if(result.changes == 0) return NextResponse.json({error: 'Nicht gefunden.', id:id},{ status: 404 });

        const user = db.prepare('SELECT id, email, firstname, lastname, role FROM users WHERE id = ?').get(id);

        return NextResponse.json(
            {
                message: 'Nutzer erfolgreich geändert',
                user
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Fehler beim Erstellen des Nutzers',
                message: error.message
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {

        if (!authorized('admin')) {return response.NOTAUTHORIZED;}

        const { id } = await params;
        const db = await openDb();
        const stmt = db.prepare('DELETE FROM users WHERE id = ?').run(id);

        if(stmt.changes < 1){return NextResponse.json({ error:"Kein User gefunden"}, { status: 400 });}
        return NextResponse.json({message:"User gelöscht"}, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Löschen des Nutzers',
                message: error.message
            },
            { status: 500 }
        );
    }
}
