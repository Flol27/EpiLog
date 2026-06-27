import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import * as argon2 from 'argon2';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(request){
    try{

        if (!await authorized('user', request)) {return response.NOTAUTHORIZED();}

        const users = await prisma.user.findMany({
            omit: { //alles ausser ...
                password: true
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

        const { email, username, password, firstname, lastname, quote, status } = await request.json();

        if (!email || !username || !password || !firstname) {
            return NextResponse.json(
                { description: 'E-Mail, Username, Passwort und Name sind erforderlich' },
                { status: 400 }
            );
        }

        const data = {};
        if (tools.checkEmail(email))        { data.email     = email; }
        if (tools.checkPassword(password))  { data.password  = await argon2.hash(password); }
        if (tools.checkUsername(username))  { data.username  = username; }
        if (tools.checkName(firstname))     { data.firstname = firstname; }
        if (tools.checkName(lastname))      { data.lastname  = lastname; }
        if (tools.checkText(quote))         { data.quote     = quote; }
        if (tools.checkText(status))        { data.status    = status; }


        const user = await prisma.user.create({
            data:data,
            omit: {
                password: true
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
                error: error
            },
            { status: 500 }
        );
    }
}
