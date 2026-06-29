import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import * as argon2 from 'argon2';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Alle Nutzer abrufen
 */
export async function GET(request) {
    try {
        if (!await authorized('user', request)) { return response.NOTAUTHORIZED(); }
        const users = await prisma.user.findMany({ omit: { password: true } });
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Fehler beim Abrufen', message: error.message }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Nutzer anlegen
 */
export async function POST(request) {
    try {
        const { email, username, password, firstname, lastname, quote, status } = await request.json();

        if (!email || !username || !password || !firstname) {
            return NextResponse.json({ description: 'E-Mail, Username, Passwort und Name sind erforderlich' }, { status: 400 });
        }

        const data = {};
        if (tools.checkEmail(email))       { data.email     = email; }
        if (tools.checkPassword(password)) { data.password  = await argon2.hash(password); }
        if (tools.checkUsername(username)) { data.username  = username; }
        if (tools.checkName(firstname))    { data.firstname = firstname; }
        if (tools.checkName(lastname))     { data.lastname  = lastname; }
        if (tools.checkText(quote))        { data.quote     = quote; }
        if (tools.checkText(status))       { data.status    = status; }

        const user = await prisma.user.create({ data, omit: { password: true } });
        return NextResponse.json({ user }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: 'Fehler beim Anlegen', message: error.message }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/users:
 *   patch:
 *     summary: Eigenes Profil aktualisieren
 */
export async function PATCH(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) { return response.NOTAUTHORIZED(); }

        const body = await request.json();
        const { firstname, lastname, quote, status, username } = body;

        const data = {};
        if (firstname && tools.checkName(firstname))   { data.firstname = firstname; }
        if (lastname  !== undefined)                   { data.lastname  = lastname || null; }
        if (quote     !== undefined)                   { data.quote     = quote || null; }
        if (status    !== undefined)                   { data.status    = status || null; }
        if (username  && tools.checkUsername(username)){ data.username  = username; }

        const user = await prisma.user.update({
            where: { id: userId },
            data,
            omit: { password: true },
        });

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Fehler beim Aktualisieren', message: error.message }, { status: 500 });
    }
}
