// lib/auth.js
import { SignJWT, jwtVerify } from 'jose';

/**
* Function to check, if the user is authorized, based on its cookie, and if its matches the role needed.
*/

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function authorize(user) {
    const token = await new SignJWT({ userId: user.id, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(secret);

    return token;
}

export async function authorized(role, request) {
    try {
        const token = request.cookies.get('session')?.value;
        if (!token) return false;
        const { payload } = await jwtVerify(token, secret);
        return payload.role === role || payload.role === 'admin';
    } catch {
        return false;
    }
}
