//@/app/api/friends
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { authorized } from '@/app/lib/auth';
import * as response from '@/app/lib/response';

/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: Alle Nutzer mit Freundschaftsstatus abrufen
 *     tags:
 *       - Friends
 *     responses:
 *       200:
 *         description: Liste aller Nutzer mit isFriend und mutualCount
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function GET(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) return response.NOTAUTHORIZED();

        // Get all friendships involving this user
        const friendships = await prisma.friendship.findMany({
            where: { OR: [{ fromId: userId }, { toId: userId }] },
        });

        // Collect IDs of all friends
        const friendIds = new Set(
            friendships.map(f => f.fromId === userId ? f.toId : f.fromId)
        );

        // Get all users except self
        const users = await prisma.user.findMany({
            where: { id: { not: userId } },
            select: {
                id:        true,
                username:  true,
                firstname: true,
                lastname:  true,
                profilePic: true,
                readStreak: true,
                quote:     true,
                status:    true,
                friendshipsFrom: { select: { toId: true } },
                friendshipsTo:   { select: { fromId: true } },
            }
        });

        const result = users.map(user => {
            // All friend IDs of this user
            const theirFriendIds = new Set([
                ...user.friendshipsFrom.map(f => f.toId),
                                           ...user.friendshipsTo.map(f => f.fromId),
            ]);

            // Mutual friends = intersection of current user's friends and their friends
            const mutualCount = [...friendIds].filter(id => theirFriendIds.has(id)).length;

            return {
                id:         user.id,
                username:   user.username,
                firstname:  user.firstname,
                lastname:   user.lastname,
                profilePic: user.profilePic,
                readStreak: user.readStreak,
                quote:      user.quote,
                status:     user.status,
                isFriend:   friendIds.has(user.id),
                                 mutualCount,
            };
        });

        return NextResponse.json({ users: result }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/friends:
 *   post:
 *     summary: Nutzer als Freund hinzufügen
 *     tags:
 *       - Friends
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetId
 *             properties:
 *               targetId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Freundschaft erfolgreich erstellt
 *       400:
 *         description: Ungültige Benutzer-ID
 *       401:
 *         description: Nicht autorisiert
 *       409:
 *         description: Bereits befreundet
 *       500:
 *         description: Serverfehler
 */
export async function POST(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) return response.NOTAUTHORIZED();

        const { targetId } = await request.json();
        if (!targetId || targetId === userId) {
            return NextResponse.json({ error: 'Ungültige Benutzer-ID.' }, { status: 400 });
        }

        // Check if already friends (in either direction)
        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { fromId: userId, toId: targetId },
                    { fromId: targetId, toId: userId },
                ]
            }
        });

        if (existing) {
            return NextResponse.json({ error: 'Bereits befreundet.' }, { status: 409 });
        }

        const friendship = await prisma.friendship.create({
            data: { fromId: userId, toId: targetId }
        });

        return NextResponse.json({ friendship }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/friends:
 *   delete:
 *     summary: Freundschaft entfernen
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: query
 *         name: targetId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID des zu entfernenden Freundes
 *     responses:
 *       200:
 *         description: Freundschaft erfolgreich entfernt
 *       400:
 *         description: targetId fehlt
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Serverfehler
 */
export async function DELETE(request) {
    try {
        const userId = await authorized('user', request);
        if (!userId) return response.NOTAUTHORIZED();

        const { searchParams } = new URL(request.url);
        const targetId = parseInt(searchParams.get('targetId'));

        if (!targetId) {
            return NextResponse.json({ error: 'targetId fehlt.' }, { status: 400 });
        }

        await prisma.friendship.deleteMany({
            where: {
                OR: [
                    { fromId: userId, toId: targetId },
                    { fromId: targetId, toId: userId },
                ]
            }
        });

        return NextResponse.json({ message: 'Freundschaft entfernt.' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
