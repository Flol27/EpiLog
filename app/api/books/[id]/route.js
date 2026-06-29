import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Buch abrufen
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Buch
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Buch nicht gefunden
 *       500:
 *         description: Serverfehler
 */
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
                error: 'Fehler beim Abrufen der Nutzerdaten',
                message: error.message
            },
            { status: 500 }
        );
    }
}


/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Buch aktualisieren
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isbn:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Buch aktualisiert
 *       400:
 *         description: Keine gültigen Daten
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Buch nicht gefunden
 *       500:
 *         description: Serverfehler
 */
export async function PUT(request, { params }) {
    try {

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { id } = await params;
        const bookId = parseInt(id, 10);
        const { isbn, title } = await request.json();


        // Dynamisches Update-Objekt aufbauen
        const data = {};
        if (tools.checkISBN(isbn))  { data.isbn  = isbn; }
        if (tools.checkText(title)) { data.title = title; }

        if(Object.keys(data).length === 0) return NextResponse.json({error: 'Keine Daten, oder nicht genug Rechte.'}, { status: 400 });


        const book = await prisma.book.update({
            where: { id: bookId },
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
            return NextResponse.json({ error: 'Buch nicht gefunden.' }, { status: 404 });
        }
        return NextResponse.json(
            {
                error: 'Fehler beim Erstellen des Buches',
                message: error.message
            },
            { status: 500 }
        );
    }
}


/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Buch löschen
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Buch gelöscht
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Buch nicht gefunden
 *       500:
 *         description: Serverfehler
 */
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

        return NextResponse.json({ book:book}, { status: 200 });

    } catch(error){
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Buch nicht gefunden.' }, { status: 404 });
        }
        return NextResponse.json(
            {
                error: 'Fehler beim Löschen des Buches',
                message: error.message
            },
            { status: 500 }
        );
    }
}
