//file:@/app/api/users/[id]/readingactivity
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';

/**
 * @swagger
 * /api/users/{id}/readingactivity:
 *   get:
 *     summary: Leseaktivität abrufen
 *     tags:
 *       - ReadingActivity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: min
 *         schema:
 *           type: string
 *         description: Startdatum (z.B. 2026-01-01)
 *       - in: query
 *         name: max
 *         schema:
 *           type: string
 *         description: Enddatum (z.B. 2026-06-29)
 *     responses:
 *       200:
 *         description: Liste der Leseaktivitäten
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const userId = parseInt(id, 10);
        if (!await authorized('user', request)) { return response.NOTAUTHORIZED(); }

        const { searchParams } = new URL(request.url);
        const max = searchParams.get('max');
        const min = searchParams.get('min');

        const where = { userId };
        if (max || min) {
            where.date = {};
            if (max) where.date.lte = new Date(max);
            if (min) where.date.gte = new Date(min);
        }

        const activities = await prisma.readingActivity.findMany({
            where,
            orderBy: { date: 'asc' }
        });

        return NextResponse.json({ activities }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Leseaktivitäten', message: error.message },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/users/{id}/readingactivity:
 *   post:
 *     summary: Leseaktivität anlegen oder Seiten hinzufügen
 *     tags:
 *       - ReadingActivity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pagesRead
 *             properties:
 *               date:
 *                 type: string
 *                 description: Optional, default ist heute
 *               pagesRead:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Leseaktivität erfolgreich angelegt
 *       400:
 *         description: Ungültige Anfragedaten
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function POST(request, { params }) {
    try {

        const userId = await authorized('user', request);

        // If Not admin AND No userId OR user not myUser --> NotAuthorized
        if (!await authorized('admin', request) && (!userId || userId !== parseInt(id))) {return response.NOTAUTHORIZED();}

        const { date, pagesRead } = await request.json();
        const activityDate = date ? new Date(date) : new Date();
        if(!pagesRead) return NextResponse.json({ error:"Bitte Seitenzahl eingeben" }, { status:400 });

        const activity = await prisma.readingActivity.upsert({
            where: { userId_date: { userId, date: activityDate } },
            update: { pagesRead: { increment: pagesRead } },
            create: { userId, pagesRead }
        });

        return NextResponse.json({ activity }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Anlegen der Leseaktivität', message: error.message },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/users/{id}/readingactivity:
 *   delete:
 *     summary: Leseaktivität löschen
 *     tags:
 *       - ReadingActivity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leseaktivität erfolgreich gelöscht
 *       400:
 *         description: Ungültige Anfragedaten
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Nicht gefunden
 *       500:
 *         description: Serverfehler
 */
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const userId = parseInt(id, 10);
        if (!await authorized('user', request)) { return response.NOTAUTHORIZED(); }

        const { date } = await request.json();

        if(!date) return NextResponse.json({ error:"Bitte Datum eingeben" }, { status:400 });

        if(!await prisma.readingActivity.findUnique({where: { userId_date: {userId, date: new Date(date)} }}))
        {
            return NextResponse.json({error:"Kein Eintrag mit dem Datum", date:date},{ status:404 });
        }

        const activity = await prisma.readingActivity.delete({
            where: { userId_date: { userId, date: new Date(date) } }
        });

        return NextResponse.json({activity}, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler beim Löschen der Leseaktivität', message: error.message, code:error.code },
            { status: 500 }
        );
    }
}
