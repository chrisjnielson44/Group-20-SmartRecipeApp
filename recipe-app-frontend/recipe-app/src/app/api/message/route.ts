import { NextRequest, NextResponse } from "next/server";
import {
  getConversationMessages,
  addMessageToConversation,
} from "@/app/lib/data";

export async function GET(req: NextRequest) {
  const conversationId = req.nextUrl.searchParams.get("conversationId");
  if (!conversationId) {
    return NextResponse.json(
      { error: "Conversation ID is required" },
      { status: 400 },
    );
  }

  try {
    const messages = await getConversationMessages(conversationId);
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching messages" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { conversationId, content, role } = await req.json();
    if (!conversationId || !content || !role) {
      return NextResponse.json(
        { error: "Conversation ID, content, and role are required" },
        { status: 400 },
      );
    }
    const newMessage = await addMessageToConversation(
      conversationId,
      content,
      role,
    );
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the message" },
      { status: 500 },
    );
  }
}

