import { NextResponse } from 'next/server';


export function NOTAUTHORIZED(){
    return NextResponse.json(
        { error: 'Nicht autorisiert. Bitte zuerst einloggen.' },
        { status: 401 }
    );
}

// Falsch die Daten falsch angegeben wurden z.B. (abc@com als EMail)
export function WRONGDATA(message, item){
    return NextResponse.json(
    {
        error:message,
        item:item
    },
    { status: 400 }
    );
}


