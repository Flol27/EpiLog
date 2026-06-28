import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authorize } from '@/app/lib/auth'; // <-- Das JWT-Schlüssel-Tool importieren

export async function createSession(user) {
    // 1. Hier wird jetzt das ECHTE, sichere JWT generiert!
    const sessionToken = await authorize(user);

    // Cookie im Browser des Nutzers setzen
    const cookieStore = await cookies();
    cookieStore.set('auth_token', sessionToken, {
        httpOnly: true, // Schützt vor Diebstahl per JavaScript (XSS)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24
    });

    // Nutzer auf das geschützte Dashboard schicken
    redirect('/dashboard');
}