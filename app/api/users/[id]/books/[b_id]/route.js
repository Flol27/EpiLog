import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


/**
 * @swagger
 * /api/users/{id}/books/{b_id}:
 *   get:
 *     summary: Einzelnes Buch eines Nutzers abrufen
 *     tags: [Reading]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: b_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nutzer mit Buch
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
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
                error: 'Fehler beim Abrufen der Nutzerdaten',
                message: error.message
            },
            { status: 500 }
        );
    }
}


/**
 * @swagger
 * /api/users/{id}/books/{b_id}:
 *   put:
 *     summary: Lesedaten eines Buches aktualisieren
 *     tags: [Reading]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: b_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pages_read:
 *                 type: integer
 *               start_date:
 *                 type: string
 *               read_date:
 *                 type: string
 *               rating:
 *                 type: integer
 *               rating_text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesedaten aktualisiert
 *       400:
 *         description: Keine gültigen Daten
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Eintrag nicht gefunden
 *       500:
 *         description: Serverfehler
 */
export async function PUT(request, { params }) {
    try {

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { id, b_id } = await params;
        const userId = parseInt(id, 10);
        const bookId = parseInt(b_id, 10);
        const { pagesRead, startDate, readDate, rating, ratingText } = await request.json();


        // Dynamisches Update-Objekt aufbauen
        const data = {};
        if (tools.checkNum(pagesRead))              { data.pagesRead          = pagesRead; }
        if (tools.checkDate(startDate))             { data.startDate          = startDate; }
        if (tools.checkDate(readDate))              { data.readDate           = readDate; }
        if (tools.checkNum(rating))                  { data.rating             = rating; }
        if (tools.checkText(ratingText))            { data.ratingText         = ratingText; }


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
                reading:reading
            },
            { status: 201 }
        );

    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Daten nicht gefunden.'}, { status: 404 });
        }
        return NextResponse.json(
            {
                error: 'Fehler beim Erstellen der Daten',
                message: error.message
            },
            { status: 500 }
        );
    }
}


/**
 * @swagger
 * /api/users/{id}/books/{b_id}:
 *   delete:
 *     summary: Buch von Nutzer entfernen
 *     tags: [Reading]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: b_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Buch entfernt
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Eintrag nicht gefunden
 *       500:
 *         description: Serverfehler
 */
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
                        error:"Nutzer hat das Buch garnicht",
                        userId:userId,
                        bookId:bookId
                    },
                    { status: 404}
                );
        }
        return NextResponse.json(
            {
                error: 'Fehler beim Entfernen des Buches',
                message: error.message
            },
            { status: 500 }
        );
    }
}
