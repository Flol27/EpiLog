import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import * as argon2 from 'argon2';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Nutzer abrufen
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nutzer
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function GET(request, { params }){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const { id } = await params;
        const userId = parseInt(id, 10);

        const user = await prisma.user.findUnique({
            where: { id:userId },
            omit: {
                password: true
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
 * /api/users/{id}:
 *   put:
 *     summary: Nutzer aktualisieren
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               role:
 *                 type: string
 *               quote:
 *                 type: string
 *               status:
 *                 type: string
 *               readStreak:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Nutzer aktualisiert
 *       400:
 *         description: Keine gültigen Daten
 *       401:
 *         description: Nicht autorisiert
 *       404:
 *         description: Nutzer nicht gefunden
 *       500:
 *         description: Serverfehler
 */
export async function PUT(request, { params }) {
    try {

        const { id } = await params;
        const { email, password, username, firstname, lastname, role, readStreak, quote, status } = await request.json();


        let admin = false;
        const userId = await authorized('user', request);
        console.log(id);
        console.log(userId);

        if (await authorized('admin', request)) {admin = true;}

        if (!userId || userId !== parseInt(id)) {return response.NOTAUTHORIZED();}




        // Dynamisches Update-Objekt aufbauen
        const data = {};
        if (tools.checkEmail(email))        { data.email             = email; }
        if (tools.checkPassword(password))  { data.password          = await argon2.hash(password); }
        if (tools.checkUsername(username))  { data.username          = username; }
        if (tools.checkName(firstname))     { data.firstname         = firstname; }
        if (tools.checkName(lastname))      { data.lastname          = lastname; }
        if (tools.checkRole(role) && admin) { data.role              = role; }
        if (tools.checkText(quote))         { data.quote             = quote; }
        if (tools.checkText(status))        { data.status            = status; }
        if (tools.checkNum(readStreak))     { data.readStreak        = readStreak; }
        if (data.readStreak)                { data.readStreakUpdated = new Date(); }



        if(Object.keys(data).length === 0){
            return NextResponse.json({error: 'Keine oder falsche Daten oder nicht genug Rechte.'}, { status: 400 });
        }


        const user = await prisma.user.update({
            where: { id: userId },
            data,
            omit: {
                password: true
            }
        });

        return NextResponse.json(
            {
                user:user
            },
            { status: 201 }
        );

    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Nutzer nicht gefunden.'}, { status: 404 });
        }
        return NextResponse.json(
            {
                error: 'Fehler beim Erstellen des Nutzers',
                message: error.message
            },
            { status: 500 }
        );
    }
}


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Nutzer löschen
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nutzer gelöscht
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function DELETE(request, { params }){
    try{

        const { id } = await params;
        const userId = await authorized('user', request);

        // Nur Admin und der eigene User können den User löschen
        if (userId !== parseInt(id) || !await authorized('admin', request)) {return response.NOTAUTHORIZED();}



        const user = await prisma.user.delete({
            where: { id:userId },
            omit: {
                password: true
            }
        });

        return NextResponse.json({ user:user }, { status: 200 });

    } catch(error){
        return NextResponse.json(
            {
                error: 'Fehler beim Löschen des Nutzers',
                message: error.message
            },
            { status: 500 }
        );
    }
}
