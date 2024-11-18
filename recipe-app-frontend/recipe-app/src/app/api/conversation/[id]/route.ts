import { NextRequest, NextResponse } from "next/server";
import { updateConversationTitle } from "@/app/lib/data";
import { deleteConversation } from "@/app/lib/data";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { title } = await req.json();
    const updatedConversation = await updateConversationTitle(params.id, title);
    return NextResponse.json(updatedConversation);
  } catch (error) {
    console.error("Error updating conversation:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the conversation" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await deleteConversation(params.id);
    return NextResponse.json({
      message: "Conversation and associated messages deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred while deleting the conversation and its messages",
      },
      { status: 500 },
    );
  }
}
