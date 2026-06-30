// app/api/users/[id]/avatar/route.js
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';


/**
 * @swagger
 * /api/users/{id}/avatar:
 *   get:
 *     summary: Profilbild abrufen
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profilbild-Pfad
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Nutzer nicht gefunden
 *       500:
 *         description: Serverfehler
 */
export async function GET(request, { params }){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { id } = await params;
        const userId = parseInt(id, 10);

        const user = await prisma.user.findUnique({
            where: {id:userId},
            select:{
                profilePic: true
            }
        });

        return NextResponse.json({profilePic:user.profilePic}, { status: 200 });
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
 * /api/users/{id}/avatar:
 *   post:
 *     summary: Profilbild hochladen
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profilbild gespeichert
 *       400:
 *         description: Kein Bild
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function POST(request, { params }) {
    try{
        if (!authorized('user')) {return response.NOTAUTHORIZED;}

        const { id } = await params;
        const userId = parseInt(id, 10);
        const formData = await request.formData();
        const file = formData.get('profilePic');

        if (!file) return NextResponse.json({ description: 'Kein Bild' }, { status: 400 });

        // Dateiname eindeutig machen
        const filename = `user-${userId}.${file.name.split('.').pop()}`;
        const filepath = path.join(process.cwd(), 'public', 'upload', 'avatars', filename);

        // Datei schreiben
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filepath, buffer);

        // Pfad in DB speichern
        await prisma.user.update({
            where: { id: userId },
            data: { profilePic: `/upload/avatars/${filename}` }
        });

        return NextResponse.json({ profilePic: `/upload/avatars/${filename}` }, { status: 201 });

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


import { unlink } from 'fs/promises'; // Oben zu den Imports hinzufügen, falls noch nicht da

/**
 * @swagger
 * /api/users/{id}/profile-picture:
 *   delete:
 *     summary: Profilbild eines Nutzers löschen
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User-ID
 *     responses:
 *       200:
 *         description: Profilbild erfolgreich gelöscht
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Nutzer nicht gefunden
 *       500:
 *         description: Serverfehler
 */
export async function DELETE(request, { params }) {
    try {
        if (!await authorized('user', request)) { return response.NOTAUTHORIZED(); }

        const { id } = await params;
        const userId = parseInt(id, 10);

        // 1. Aktuelles Bild aus der DB holen
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { profilePic: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'Nutzer nicht gefunden' }, { status: 404 });
        }

        // 2. Falls ein Bild existiert, Datei vom Server löschen
        if (user.profilePic) {
            const filepath = path.join(process.cwd(), 'public', user.profilePic);
            try {
                await unlink(filepath);
            } catch (fileError) {
                // Falls die Datei im Dateisystem gar nicht existiert, loggen wir es nur,
                // blockieren aber nicht das Zurücksetzen der Datenbank.
                console.error('Datei konnte nicht gelöscht werden:', fileError.message);
            }
        }

        // 3. Datenbank-Eintrag zurücksetzen (auf null oder leeren String)
        await prisma.user.update({
            where: { id: userId },
            data: { profilePic: null }
        });

        return NextResponse.json({ message: 'Profilbild erfolgreich gelöscht' }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Fehler beim Löschen des Profilbilds',
                message: error.message
            },
            { status: 500 }
        );
    }
}
