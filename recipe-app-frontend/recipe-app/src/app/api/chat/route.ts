import { NextRequest, NextResponse } from "next/server";
import {
    getConversationMessages,
    addMessageToConversation,
} from "@/app/lib/data";

const MAX_HISTORY_MESSAGES = 5;

export async function POST(req: NextRequest) {
    try {
        const { message, conversationId } = await req.json();

        if (!message || !conversationId) {
            return NextResponse.json(
                { error: "Message and conversationId are required" },
                { status: 400 },
            );
        }

        // Save the user's message
        await addMessageToConversation(conversationId, message, "user");

        // Fetch recent chat history
        const recentMessages = await getConversationMessages(
            conversationId,
            1,
            MAX_HISTORY_MESSAGES,
        );

        const conversation_history = recentMessages.map((msg) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
        }));

        // Send request to FastAPI
        const fastApiResponse = await fetch("http://localhost:8000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: message,
                conversation_history: conversation_history,
            }),
        });

        if (!fastApiResponse.ok) {
            throw new Error(
                `FastAPI request failed with status ${fastApiResponse.status}`,
            );
        }

        const data = await fastApiResponse.json();

        // Save the assistant's reply
        await addMessageToConversation(
            conversationId,
            data.reply,
            "assistant",
            data.reasoning,
            data.chart,
        );

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 },
        );
    }
}