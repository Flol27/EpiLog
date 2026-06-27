import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import * as argon2 from 'argon2';
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';
import * as tools from '@/app/lib/tools';


export async function GET(request, { params }){
    try{

        if (!authorized('admin')) {return response.NOTAUTHORIZED;}

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
                description: 'Fehler beim Abrufen der Nutzerdaten',
                error: error.message
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {

        let admin = false;

        if (authorized('admin')) {admin = true;}
        else if (authorized('user')) {admin = false;}
        else {return response.NOTAUTHORIZED;}

        const { id } = await params;
        const userId = parseInt(id, 10);
        const { email, password, username, firstname, lastname, role, readStreak, quote, status } = await request.json();


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
            return NextResponse.json({description: 'Keine oder falsche Daten oder nicht genug Rechte.'}, { status: 400 });
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
                description: 'Nutzer erfolgreich geändert',
                user:user
            },
            { status: 201 }
        );

    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json({ description: 'Nutzer nicht gefunden.'}, { status: 404 });
        }
        return NextResponse.json(
            {
                description: 'Fehler beim Erstellen des Nutzers',
                error: error.message
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }){
    try{

        if (!authorized('admin')) {return response.NOTAUTHORIZED;}

        const { id } = await params;
        const userId = parseInt(id, 10);

        const user = await prisma.user.delete({
            where: { id:userId },
            omit: {
                password: true
            }
        });

        return NextResponse.json({ description:"Nutzer gelöscht", user:user}, { status: 200 });

    } catch(error){
        return NextResponse.json(
            {
                description: 'Fehler beim Löschen des Nutzers',
                error: error.message
            },
            { status: 500 }
        );
    }
}
