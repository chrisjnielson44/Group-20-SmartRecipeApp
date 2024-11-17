import { NextRequest, NextResponse } from "next/server";
import { getConversations, createConversation } from "@/app/lib/data";

export async function GET() {
  try {
    const conversations = await getConversations();
    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching conversations" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const newConversation = await createConversation(title);
    return NextResponse.json(newConversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the conversation" },
      { status: 500 },
    );
  }
}
