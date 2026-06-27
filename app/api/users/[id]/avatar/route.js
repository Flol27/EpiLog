// app/api/users/[id]/avatar/route.js
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { authorized } from '@/app/lib/auth';



export async function GET(request, { params }){
    try{

        if (!authorized('user')) {return response.NOTAUTHORIZED;}

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
                description: 'Fehler beim Abrufen der Nutzerdaten',
                error: error.message
            },
            { status: 500 }
        );
    }
}

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
                description: 'Fehler beim Abrufen der Nutzerdaten',
                error: error.message
            },
            { status: 500 }
        );
    }
}
