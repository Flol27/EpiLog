import { NextRequest, NextResponse } from 'next/server';
import { authorized } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const userId = await authorized('user', request);
    if (!userId) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId as number },
        select: {
            id:         true,
            username:   true,
            firstname:  true,
            lastname:   true,
            email:      true,
            role:       true,
            profilePic: true,
            readStreak: true,
            quote:      true,
            status:     true,
        }
    });

    if (!user) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
}
