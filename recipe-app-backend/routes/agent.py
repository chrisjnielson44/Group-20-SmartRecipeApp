from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from RecipeAgent.agent import get_agent

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[Message] = []

class ChatResponse(BaseModel):
    reply: str
    reasoning: Optional[str] = None
    chart: Optional[Dict] = None

@router.post("/chat") # Changed from "/api/chat" since the prefix is already added in main.py
def chat(request: ChatRequest):
    """
    Process a chat message and return a response
    """
    try:
        # Convert the conversation history to the format expected by the agent
        conversation_history = [
            {"role": msg.role, "content": msg.content}
            for msg in request.conversation_history
        ]

        agent = get_agent()
        response = agent.process_message(
            request.message,
            conversation_history
        )

        return ChatResponse(
            reply=response["reply"],
            reasoning=response["reasoning"],
            chart=response.get("data")  # Only include chart if data is present
        )

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")  # For debugging
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
