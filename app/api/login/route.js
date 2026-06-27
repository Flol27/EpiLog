import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import * as argon2 from 'argon2';
import { authorize } from '@/app/lib/auth';



export async function POST(request){
    try{

        const { email, username, password } = await request.json();

        if (!email && !username) {
            return NextResponse.json(
                { description: 'E-Mail oder Username sind erforderlich' },
                { status: 400 }
            );
        }
        if (!password) {
            return NextResponse.json(
                { description: 'Passwort ist erforderlich' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: email ? { email } : { username },
            select: {
                id:        true,
                password:  true,
                role:      true
            }
        });

        if(!user) { return NextResponse.json({ description:"Nutzer nicht gefunden"}, { status: 404 })}

        const passwordCorrect = await argon2.verify(user.password, password);


        if(passwordCorrect){
            const token = await authorize(user);

            const response = NextResponse.json(
                {
                    description: 'Angemeldet'
                },
                { status: 200 }
            );
            response.cookies.set('session', token, { httpOnly: true });
            return response;
        } else {
            return NextResponse.json(
                {
                    description: 'Falsches Passwort'
                },
                { status: 401 }
            );
        }


    } catch(error){
        return NextResponse.json(
            {
                description: 'Fehler beim Abrufen der Nutzerdaten',
                error: error.message
            },
            { status: 500 }
        );
    }
}
