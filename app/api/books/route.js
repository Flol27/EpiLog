import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Alle Bücher abrufen
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Liste aller Bücher
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
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
                error: 'Fehler beim Abrufen der Nutzerdaten',
                message: error.message
            },
            { status: 500 }
        );
    }
}


/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Buch anlegen
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isbn
 *             properties:
 *               isbn:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Buch angelegt
 *       400:
 *         description: Ungültige Daten
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function POST(request){
    try{

        //if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { isbn, title } = await request.json();

        if (!isbn) {
            return NextResponse.json(
                { error: 'ISBN ist erforderlich' },
                { status: 400 }
            );
        }

        if(!tools.checkISBN(isbn))       return response.WRONGDATA("ISBN überprüfen",   isbn);

        const book = await prisma.book.create({
            data:{
                isbn:  isbn,
                title: title,
            }
        });

        return NextResponse.json(
            {
                book:book
            },
            { status: 201 }
        );

    } catch(error){
        return NextResponse.json(
            {
                error: 'Fehler beim Abrufen der Buchdaten',
                message: error.message
            },
            { status: 500 }
        );
    }
}
