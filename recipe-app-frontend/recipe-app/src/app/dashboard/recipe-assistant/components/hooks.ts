"use client";
import { useState, useEffect } from "react";
import { Conversation } from "./types";

export const useConversations = (): [
  Conversation[],
  React.Dispatch<React.SetStateAction<Conversation[]>>,
] => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversation");
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data: Conversation[] = await response.json();
        setConversations(
          data.map((conv) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
          })),
        );
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  return [conversations, setConversations];
};
