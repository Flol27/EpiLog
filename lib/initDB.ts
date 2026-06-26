import { prisma } from "@/lib/prisma"
import argon2 from 'argon2'

export async function initDB() {
    const count = await prisma.user.count()

    if (count === 0) {
        await prisma.user.create({
            data: {
                email:     process.env.ADMIN_EMAIL!,
                username:  'admin',
                password:  await argon2.hash(process.env.ADMIN_PASSWORD!),
                role:      'admin',
                firstname: 'Admin',
            }
        })
        console.log('Admin-User angelegt.')
    }
}
