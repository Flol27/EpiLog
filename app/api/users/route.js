import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import * as argon2 from 'argon2';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(){
    try{

        if (!authorized('admin')) {return response.NOTAUTHORIZED;}

        const users = await prisma.user.findMany({
            select: {
                id:        true,
                email:     true,
                username:  true,
                firstname: true,
                lastname:  true,
                role:      true
            }
        });

        return NextResponse.json({users:users}, { status: 200 });

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

export async function POST(request){
    try{

        const { email, username, password, firstname, lastname } = await request.json();

        if (!email || !username || !password || !firstname) {
            return NextResponse.json(
                { description: 'E-Mail, Username, Passwort und Name sind erforderlich' },
                { status: 400 }
            );
        }

        if(!tools.checkEmail(email))       return response.WRONGDATA("E-Mail überprüfen",   email);
        if(!tools.checkName(username))     return response.WRONGDATA("Username überprüfen", username);
        if(!tools.checkPassword(password)) return response.WRONGDATA("Passwort überprüfen", password);
        if(!tools.checkName(firstname))    return response.WRONGDATA("Vorname überprüfen",  firstname);
        if(!tools.checkName(lastname))     return response.WRONGDATA("Nachname überprüfen", lastname);

        const hash = await argon2.hash(password);

        const response = await prisma.user.create({
            data:{
                email:     email,
                username:  username,
                password:  hash,
                firstname: firstname,
                lastname:  lastname
            }
        });

        const user = await prisma.user.findUnique({
            where: {id:response.id},
            select: {
                id:        true,
                email:     true,
                username:  true,
                firstname: true,
                lastname:  true,
                role:      true
            }
        });

        return NextResponse.json(
            {
                description: 'Nutzer erfolgreich angelegt',
                user:user
            },
            { status: 201 }
        );

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
