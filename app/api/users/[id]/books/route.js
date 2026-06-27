import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(request, { params }){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { id } = await params;
        const u_id = parseInt(id, 10);

        const user = await prisma.user.findUnique({
            where: { id:u_id },
            select: {
                id:        true,
                email:     true,
                username:  true,
                firstname: true,
                lastname:  true,
                role:      true,
                bookUsers: {
                    select: {
                        book: true
                    }
                }
            }
        });

        return NextResponse.json({user:user}, { status: 200 });

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

export async function POST(request, { params }){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { b_id } = await request.json();
        const { id } = await params;
        const u_id = parseInt(id, 10);

        if (!u_id || !b_id) {
            return NextResponse.json(
                { description: 'Nutzer und Buch sind erforderlich', u_id:u_id, b_id:b_id },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { id: u_id } })
        const book = await prisma.book.findUnique({ where: { id: b_id } })

        if (!user) return NextResponse.json({ description: 'Nutzer nicht gefunden.' }, { status: 404 })
        if (!book) return NextResponse.json({ description: 'Buch nicht gefunden.' }, { status: 404 })


        const response = await prisma.bookUser.upsert({
            where: {
                userId_bookId: {
                    userId: u_id,
                    bookId: b_id,
            }},
            create:{
                userId: u_id,
                bookId: b_id
            },
            update:{}
        });

        return NextResponse.json(
            {
                description: 'Buch erfolgreich hinzugefügt',
                user:response
            },
            { status: 201 }
        );

    } catch(error){
        return NextResponse.json(
            {
                description: 'Fehler beim Hinzufügen des Buches',
                error: error.message
            },
            { status: 500 }
        );
    }
}



