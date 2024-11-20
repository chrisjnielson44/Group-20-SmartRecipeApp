import { NextResponse } from "next/server";
import { getUserPreferences, updateUserPreferences } from "@/app/lib/data";

export async function GET() {
    try {
        const preferences = await getUserPreferences();
        return NextResponse.json(preferences);
    } catch (error) {
        console.error("Error fetching preferences:", error);
        return new NextResponse(
            JSON.stringify({ error: "Failed to fetch preferences" }),
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const preferences = await req.json();
        const updatedPreferences = await updateUserPreferences(preferences);
        return NextResponse.json(updatedPreferences);
    } catch (error) {
        console.error("Error updating preferences:", error);
        return new NextResponse(
            JSON.stringify({ error: "Failed to update preferences" }),
            { status: 500 }
        );
    }
}