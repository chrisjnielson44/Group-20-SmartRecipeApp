import { deleteUserData } from "@/app/lib/data";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    const deletedUserData = await deleteUserData();
    return new NextResponse(JSON.stringify(deletedUserData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}