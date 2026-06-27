import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(request, { params }){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { id, b_id } = await params;
        const u_id = parseInt(id, 10);
        const bookId = parseInt(b_id, 10);

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
                    where: {bookId:bookId},
                    select: {
                        book: true
                    }
                }
            }
        });

        return NextResponse.json({user:user},{ status: 200 });

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

        const { id, b_id } = await params;
        const userId = parseInt(id, 10);
        const bookId = parseInt(b_id, 10);
        const { pages_read, readstreak_edit_date, start_date, read_date, rating, rating_text } = await request.json();


        // Dynamisches Update-Objekt aufbauen
        const data = {};
        if (tools.checkNum(pages_read))              { data.pagesRead          = pages_read; }
        if (tools.checkDate(readstreak_edit_date))   { data.readstreakEditDate = readstreak_edit_date; }
        if (tools.checkDate(start_date))             { data.startDate          = start_date; }
        if (tools.checkDate(read_date))              { data.readDate           = read_date; }
        if (tools.checkNum(rating))                  { data.rating             = rating; }
        if (tools.checkText(rating_text))            { data.ratingText         = rating_text; }


        if(Object.keys(data).length === 0) return NextResponse.json({description: 'Keine oder falsche Daten'}, { status: 400 });


        const reading = await prisma.bookUser.update({
            where: {
                userId_bookId: {
                    userId:userId,
                    bookId:bookId
                }
            },
            data
        });

        return NextResponse.json(
            {
                description: 'Daten erfolgreich geändert',
                reading:reading
            },
            { status: 201 }
        );

    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json({ description: 'Daten nicht gefunden.'}, { status: 404 });
        }
        return NextResponse.json(
            {
                description: 'Fehler beim Erstellen der Daten',
                error: error.message
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { id, b_id } = await params;
        const userId = parseInt(id, 10);
        const bookId = parseInt(b_id, 10);

        await prisma.bookUser.delete({
            where: {
                userId_bookId: {
                    userId:userId,
                    bookId:bookId
                }
            }
        });

        return NextResponse.json(
            {
                description:"Buch entfernt",
                userId:userId,
                bookId:bookId
            },
            { status: 200 }
        );

    } catch(error){
        // Not Exists Error
        if (error.code === 'P2025') {
            return NextResponse.json(
                    {
                        description:"Nutzer hat das Buch garnicht",
                        userId:userId,
                        bookId:bookId
                    },
                    { status: 404}
                );
        }
        return NextResponse.json(
            {
                description: 'Fehler beim Entfernen des Buches',
                error: error.message
            },
            { status: 500 }
        );
    }
}
