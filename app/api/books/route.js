import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(request){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const books = await prisma.book.findMany({
            select: {
                id:    true,
                isbn:  true,
                title: true
            }
        });

        return NextResponse.json({books:books}, { status: 200 });

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

export async function POST(request){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { isbn, title } = await request.json();

        if (!isbn) {
            return NextResponse.json(
                { description: 'ISBN ist erforderlich' },
                { status: 400 }
            );
        }

        if(!tools.checkISBN(isbn))       return response.WRONGDATA("ISBN überprüfen",   isbn);
        // Braucht man nicht
        // if(!tools.checkName(title))     return response.WRONGDATA("Username überprüfen", title);

        const response = await prisma.book.create({
            data:{
                isbn:  isbn,
                title: title
            }
        });

        const book = await prisma.book.findUnique({
            where: {id:response.id},
            select: {
                id:    true,
                isbn:  true,
                title: true
            }
        });

        return NextResponse.json(
            {
                description: 'Buch erfolgreich angelegt',
                book:book
            },
            { status: 201 }
        );

    } catch(error){
        return NextResponse.json(
            {
                description: 'Fehler beim Abrufen der Buchdaten',
                error: error.message
            },
            { status: 500 }
        );
    }
}
