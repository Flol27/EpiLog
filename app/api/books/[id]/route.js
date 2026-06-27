import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(request, { params }){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { id } = await params;
        const b_id = parseInt(id, 10);

        const book = await prisma.book.findUnique({
            where: { id:b_id },
            select: {
                id:    true,
                isbn:  true,
                title: true
            }
        });

        return NextResponse.json({book:book},{ status: 200 });

    } catch(error){
        return NextResponse.json(
            {
                description: 'Fehler beim Abrufen der Nutzerdaten',
                error: error.message
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { id } = await params;
        const b_id = parseInt(id, 10);
        const { isbn, title } = await request.json();


        // Dynamisches Update-Objekt aufbauen
        const data = {};
        if (tools.checkEmail(isbn))        { data.isbn     = isbn; }
        if (tools.checkPassword(title))    { data.title    = title; }

        if(Object.keys(data).length === 0) return NextResponse.json({description: 'Keine Daten, oder nicht genug Rechte.'}, { status: 400 });


        const book = await prisma.book.update({
            where: { id: b_id },
            data,
            select: {
                id:    true,
                isbn:  true,
                title: true
            }
        });

        return NextResponse.json(
            {
                description: 'Buch erfolgreich geändert',
                book:book
            },
            { status: 201 }
        );

    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json({ description: 'Buch nicht gefunden.', id: u_id }, { status: 404 });
        }
        return NextResponse.json(
            {
                description: 'Fehler beim Erstellen des Buches',
                error: error.message
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { id } = await params;
        const b_id = parseInt(id, 10);

        const book = await prisma.book.delete({
            where: { id:b_id },
            select: {
                id:    true,
                isbn:  true,
                title: true
            }
        });

        return NextResponse.json({ description:"Buch gelöscht", book:book}, { status: 200 });

    } catch(error){
        return NextResponse.json(
            {
                description: 'Fehler beim Löschen des Buches',
                error: error.message
            },
            { status: 500 }
        );
    }
}
