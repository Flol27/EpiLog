import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';


/**
 * @swagger
 * /api/users/{id}/books:
 *   get:
 *     summary: Bücher eines Nutzers abrufen
 *     tags: [Reading]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nutzer mit Büchern
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
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
                error: 'Fehler beim Abrufen der Nutzerdaten',
                message: error.message
            },
            { status: 500 }
        );
    }
}


/**
 * @swagger
 * /api/users/{id}/books:
 *   post:
 *     summary: Buch zu Nutzer hinzufügen
 *     tags: [Reading]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - b_id
 *             properties:
 *               b_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Buch hinzugefügt
 *       400:
 *         description: Pflichtfelder fehlen
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Nutzer oder Buch nicht gefunden
 *       500:
 *         description: Serverfehler
 */
export async function POST(request, { params }){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { b_id } = await request.json();
        const { id } = await params;
        const u_id = parseInt(id, 10);

        if (!u_id || !b_id) {
            return NextResponse.json(
                { error: 'Nutzer und Buch sind erforderlich', u_id:u_id, b_id:b_id },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { id: u_id } })
        const book = await prisma.book.findUnique({ where: { id: b_id } })

        if (!user) return NextResponse.json({ error: 'Nutzer nicht gefunden.' }, { status: 404 })
        if (!book) return NextResponse.json({ error: 'Buch nicht gefunden.' }, { status: 404 })


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
                user:response
            },
            { status: 201 }
        );

    } catch(error){
        return NextResponse.json(
            {
                error: 'Fehler beim Hinzufügen des Buches',
                message: error.message
            },
            { status: 500 }
        );
    }
}



