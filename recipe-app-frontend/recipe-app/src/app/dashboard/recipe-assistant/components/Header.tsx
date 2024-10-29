"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AnimatedTitle } from "./AnimatedTitle";
import { Conversation } from "./types";

interface HeaderProps {
  isSidebarOpen: boolean;
  handleToggleSidebar: () => void;
  selectedConversation: Conversation | null;
  isInitialLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  handleToggleSidebar,
  selectedConversation,
  isInitialLoading,
}) => (
  <div className="flex items-center justify-between space-y-2">
    {isInitialLoading ? (
      <div className="h-9 w-[600px] bg-gray-200 dark:bg-muted rounded animate-pulse"></div>
    ) : (
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
          className="p-2 text-primary"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-6 w-6" />
          ) : (
            <PanelLeftOpen className="h-6 w-6" />
          )}
          <span className="sr-only">
            {isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          </span>
        </Button>
        {selectedConversation && (
          <AnimatedTitle
            title={selectedConversation.title || "Untitled Conversation"}
            className="text-3xl font-bold tracking-tight"
          />
        )}
      </div>
    )}
  </div>
);
export default Header;
