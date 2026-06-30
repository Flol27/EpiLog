//@/app/api/users/me
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Eigene Nutzerdaten abrufen
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Eigene Nutzerdaten erfolgreich abgerufen
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function GET(request){
    try{

        const userId = await authorized('user', request);

        if (!userId) {return response.NOTAUTHORIZED();}

        const user = await prisma.user.findUnique({
            where: { id:userId },
            omit: { //alles ausser ...
                password: true
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
