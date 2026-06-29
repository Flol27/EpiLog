import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import * as argon2 from 'argon2';
import { authorize } from '@/app/lib/auth';
import { RateLimiterMemory } from 'rate-limiter-flexible';


const rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Einloggen
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Erfolgreich eingeloggt
 *       400:
 *         description: Pflichtfelder fehlen
 *       401:
 *         description: Falsches Passwort
 *       404:
 *         description: Nutzer nicht gefunden
 *       429:
 *         description: Zu viele Versuche
 *       500:
 *         description: Serverfehler
 */
export async function POST(request){
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

    try {
        await rateLimiter.consume(ip);
    } catch {
        return NextResponse.json(
            { error: 'Zu viele Versuche' },
            { status: 429 }
        );
    }
    try{

        const { email, username, password } = await request.json();

        if (!email && !username) {
            return NextResponse.json(
                { error: 'E-Mail oder Username sind erforderlich' },
                { status: 400 }
            );
        }
        if (!password) {
            return NextResponse.json(
                { error: 'Passwort ist erforderlich' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: email ? { email:email } : { username:username },
            select: {
                id:        true,
                password:  true,
                role:      true
            }
        });

        if(!user) { return NextResponse.json({ error:"Nutzer nicht gefunden"}, { status: 404 })}

        const passwordCorrect = await argon2.verify(user.password, password);


        if(passwordCorrect){
            rateLimiter.reward(ip);
            const token = await authorize(user);

            const response = NextResponse.json({ status: 200 });
            response.cookies.set('session', token, { httpOnly: true });
            return response;
        } else {
            return NextResponse.json(
                {
                    error: 'Falsches Passwort'
                },
                { status: 401 }
            );
        }

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
