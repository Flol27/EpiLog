import { NextResponse } from 'next/server';


export const NOTAUTHORIZED = NextResponse.json(
    { description: 'Nicht autorisiert. Bitte zuerst einloggen.' },
    { status: 401 }
);

export function WRONGDATA(message, item){
    return NextResponse.json(
    {
        description:message,
        item:item
    },
    { status: 400 }
    );
}


