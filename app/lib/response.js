import { NextResponse } from 'next/server';


export const NOTAUTHORIZED = NextResponse.json(
    { error: 'Nicht autorisiert. Bitte zuerst einloggen.' },
    { status: 401 }
);


