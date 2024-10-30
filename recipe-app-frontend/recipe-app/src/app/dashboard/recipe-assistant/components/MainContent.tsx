"use client";

import React from "react";
import { ChatAgent } from "./ReciepeAgent";
import EmptyState from "./EmptyState";
import { Conversation } from "./types";

interface MainContentProps {
  isInitialLoading: boolean;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  updateConversationTitle: (
    conversationId: string,
    newTitle: string,
  ) => Promise<void>;
  handleNewConversation: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  isInitialLoading,
  conversations,
  selectedConversation,
  updateConversationTitle,
  handleNewConversation,
}) => {
  if (isInitialLoading) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="animate-pulse text-lg text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return <EmptyState onNewConversation={handleNewConversation} />;
  }

  return (
    <ChatAgent
      conversation={selectedConversation}
      onUpdateConversationTitle={updateConversationTitle}
    />
  );
};

export default MainContent;
