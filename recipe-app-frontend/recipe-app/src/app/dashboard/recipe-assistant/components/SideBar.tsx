import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SquarePenIcon } from "lucide-react";
import { DeleteConversationDialog } from "./DeleteConversationDialog";
import { motion, AnimatePresence } from "framer-motion";

interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
}

interface ConversationSidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  selectedConversation: Conversation | null;
}

const groupConversations = (conversations: Conversation[]) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  return conversations.reduce(
    (groups, conv) => {
      const convDate = new Date(conv.createdAt);
      if (convDate.toDateString() === today.toDateString()) {
        groups.today.push(conv);
      } else if (convDate.toDateString() === yesterday.toDateString()) {
        groups.yesterday.push(conv);
      } else if (convDate > lastWeek) {
        groups.lastWeek.push(conv);
      } else {
        groups.older.push(conv);
      }
      return groups;
    },
    { today: [], yesterday: [], lastWeek: [], older: [] } as Record<
      string,
      Conversation[]
    >,
  );
};

const ConversationGroup: React.FC<{
  title: string;
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  selectedConversation: Conversation | null;
}> = ({
  title,
  conversations,
  onSelectConversation,
  onDeleteConversation,
  selectedConversation,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="mb-4"
  >
    <h4 className="text-sm font-semibold text-muted-foreground mb-2">
      {title}
    </h4>
    <div className="space-y-2">
      {conversations.map((conv, index) => (
        <motion.div
          key={conv.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="flex items-center space-x-2"
        >
          <Button
            variant={
              selectedConversation?.id === conv.id ? "secondary" : "ghost"
            }
            className="flex-grow justify-start truncate"
            onClick={() => onSelectConversation(conv.id)}
          >
            <span className="truncate">{conv.title}</span>
          </Button>
          <DeleteConversationDialog
            onDelete={() => onDeleteConversation(conv.id)}
          />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  isOpen,
  conversations,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  selectedConversation,
}) => {
  const groupedConversations = groupConversations(conversations);

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-background border-r rounded-sm transition-all duration-300 ease-in-out ${
        isOpen ? "w-80" : "w-0 -translate-x-full"
      }`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ScrollArea className="flex-grow h-full w-full p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between mb-4"
              >
                <h3 className="text-lg font-bold text-primary">
                  Conversations
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNewConversation}
                  className="hover:bg-secondary hover:text-primary"
                >
                  <SquarePenIcon className="h-5 w-5" />
                </Button>
              </motion.div>
              <AnimatePresence>
                {groupedConversations.today.length > 0 && (
                  <ConversationGroup
                    key="today"
                    title="Today"
                    conversations={groupedConversations.today}
                    onSelectConversation={onSelectConversation}
                    onDeleteConversation={onDeleteConversation}
                    selectedConversation={selectedConversation}
                  />
                )}
                {groupedConversations.yesterday.length > 0 && (
                  <ConversationGroup
                    key="yesterday"
                    title="Yesterday"
                    conversations={groupedConversations.yesterday}
                    onSelectConversation={onSelectConversation}
                    onDeleteConversation={onDeleteConversation}
                    selectedConversation={selectedConversation}
                  />
                )}
                {groupedConversations.lastWeek.length > 0 && (
                  <ConversationGroup
                    key="lastWeek"
                    title="Last Week"
                    conversations={groupedConversations.lastWeek}
                    onSelectConversation={onSelectConversation}
                    onDeleteConversation={onDeleteConversation}
                    selectedConversation={selectedConversation}
                  />
                )}
                {groupedConversations.older.length > 0 && (
                  <ConversationGroup
                    key="older"
                    title="Older"
                    conversations={groupedConversations.older}
                    onSelectConversation={onSelectConversation}
                    onDeleteConversation={onDeleteConversation}
                    selectedConversation={selectedConversation}
                  />
                )}
              </AnimatePresence>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
