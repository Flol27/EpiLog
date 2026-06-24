import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createSession(userId) {
    // In der Praxis würdest du hier z.B. ein verschlüsseltes JWT erstellen
    const sessionToken = `session_for_user_${userId}`;

    // Cookie im Browser des Nutzers setzen
    const cookieStore = await cookies();
    cookieStore.set('auth_token', sessionToken, {
        httpOnly: true, // Schützt vor Diebstahl per JavaScript (XSS)
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    });

    // Nutzer auf das geschützte Dashboard schicken
    redirect('/');
}
