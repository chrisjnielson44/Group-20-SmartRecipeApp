"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ChartComponent from "./charts/Charts";
import { Textarea } from "@/components/ui/textarea";
import { Message, ChatAgentProps } from "@/app/types/chat";
import { validateChartData } from "@/app/types/validation";

const dbWittyMessages = [
 " ",
];

export function ChatAgent({
  conversation,
  onUpdateConversationTitle,
}: ChatAgentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [thinkingMessage, setThinkingMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expandedReasonings, setExpandedReasonings] = useState<{
    [key: string]: boolean;
  }>({});
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {},
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [assistantTypingText, setAssistantTypingText] = useState("");
  const aiMessageIdRef = useRef<string | null>(null);

  const copyToClipboard = useCallback((text: string, messageId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [messageId]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [messageId]: false }));
      }, 2000);
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (assistantTypingText !== "" && aiMessageIdRef.current) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageIdRef.current
            ? { ...msg, text: assistantTypingText }
            : msg,
        ),
      );
      scrollToBottom();
    }
  }, [assistantTypingText, scrollToBottom]);

  const fetchMessages = useCallback(async () => {
    if (!conversation) return;

    try {
      const response = await fetch(
        `/api/message?conversationId=${conversation.id}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: {
        id: string;
        content: string;
        role: string;
        reasoning?: string;
        chart?: unknown;
      }[] = await response.json();

      const newMessages: Message[] = [];
      data.forEach((msg) => {
        if (msg.role === "user") {
          newMessages.push({
            id: msg.id,
            text: msg.content,
            isUser: true,
            isTyping: false,
            type: "text",
          });
        } else {
          // AI message
          if (msg.content) {
            newMessages.push({
              id: msg.id + "_text",
              text: msg.content,
              isUser: false,
              isTyping: false,
              reasoning: msg.reasoning,
              type: "text",
            });
          }
          if (msg.chart) {
            try {
              const validatedChart = validateChartData(msg.chart);
              newMessages.push({
                id: msg.id + "_chart",
                isUser: false,
                chart: validatedChart,
                type: "chart",
              });
            } catch (error) {
              console.error("Invalid chart data received:", error);
              // Optionally add an error message to the chat
            }
          }
        }
      });
      setMessages(newMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [conversation]);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [conversation, fetchMessages]);

  const getRandomDbWittyMessage = () => {
    const randomIndex = Math.floor(Math.random() * dbWittyMessages.length);
    return dbWittyMessages[randomIndex];
  };

  const handleSend = async () => {
    if (input.trim() === "" || !conversation) return;

    const isFirstUserMessage = messages.filter((msg) => msg.isUser).length === 0;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      type: "text",
    };

    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsTyping(true);
    setThinkingMessage(getRandomDbWittyMessage());

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationId: conversation.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from chat API");
      }

      const data: {
        reply: string;
        reasoning?: string;
        chart?: unknown;
      } = await response.json();
      setIsTyping(false);

      const aiMessageId = Date.now().toString();
      aiMessageIdRef.current = aiMessageId;

      // Add AI text message
      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          text: "",
          isUser: false,
          isTyping: true,
          reasoning: data.reasoning,
          type: "text",
        },
      ]);

      // Animate typing
      let currentText = "";
      const typingInterval = setInterval(() => {
        if (currentText.length < data.reply.length) {
          const charsToAdd = Math.min(
            20,
            data.reply.length - currentText.length,
          );
          currentText = data.reply.slice(0, currentText.length + charsToAdd);
          setAssistantTypingText(currentText);
        } else {
          clearInterval(typingInterval);
          setAssistantTypingText("");
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, isTyping: false, text: data.reply }
                : msg,
            ),
          );

          if (isFirstUserMessage && userMessage.text) {
            generateTitle(userMessage.text);
          }

          // Add chart message if exists
          if (data.chart) {
            try {
              const validatedChart = validateChartData(data.chart);
              const chartMessageId = (Date.now() + 1).toString();
              setMessages((prev) => [
                ...prev,
                {
                  id: chartMessageId,
                  isUser: false,
                  chart: validatedChart,
                  type: "chart",
                },
              ]);
            } catch (error) {
              console.error("Invalid chart data received:", error);
              // Optionally show an error message to the user
            }
          }
        }
      }, 5);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setIsTyping(false);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const generateTitle = useCallback(
    async (firstUserMessage: string) => {
      if (!conversation) return;

      try {
        const titleResponse = await fetch("/api/generate-title", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: conversation.id,
            message: firstUserMessage,
          }),
        });

        if (!titleResponse.ok) {
          throw new Error("Failed to generate title");
        }

        const { title } = await titleResponse.json();
        if (title && title !== conversation.title) {
          await onUpdateConversationTitle(conversation.id, title);
        }
      } catch (error) {
        console.error("Error generating title:", error);
      }
    },
    [conversation, onUpdateConversationTitle],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const toggleReasoning = useCallback((messageId: string) => {
    setExpandedReasonings((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  }, []);

  return (
    <Card className="w-full bg-secondary">
      <CardContent>
        <div className="h-[75vh] lg:h-[84vh] xl:[86vh] overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                {message.isUser ? (
                  <div className="p-4 mt-4 rounded-lg max-w-[80%] break-words bg-primary text-primary-foreground">
                    {message.text}
                  </div>
                ) : (
                  <div className="flex flex-col items-start max-w-[80%] w-full">
                    <div className="p-4 px-6 mt-4 rounded-lg bg-background text-secondary-foreground overflow-hidden w-full">
                      {message.type === "text" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              className="prose dark:prose-invert max-w-none overflow-x-auto"
                              components={{
                                table: (props) => (
                                    <div className="overflow-x-auto my-8">
                                      <table
                                          className="min-w-full divide-y divide-gray-200 bg-background"
                                          {...props}
                                      />
                                    </div>
                                ),
                                th: (props) => (
                                    <th
                                        className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                                        {...props}
                                    />
                                ),
                                td: (props) => (
                                    <td
                                        className="px-6 py-4 dark:bg-gray-900 whitespace-nowrap text-sm text-gray-500 dark:text-white"
                                        {...props}
                                    />
                                ),
                                code: (props) => (
                                    <code
                                        {...props}
                                        className="break-all whitespace-pre-wrap"
                                    />
                                ),
                                pre: (props) => (
                                    <pre {...props} className="overflow-x-auto" />
                                ),
                              }}
                          >
                            {message.isTyping ? assistantTypingText : message.text || ""}
                          </ReactMarkdown>
                          {message.isTyping && (
                            <span className="inline-block ml-1 animate-pulse">
                              ▋
                            </span>
                          )}

                          <div className="mt-4 pt-2 border-t border-border">
                            <div className="flex justify-between items-center">
                              {message.reasoning && (
                                <Button
                                  onClick={() => toggleReasoning(message.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  {expandedReasonings[message.id]
                                    ? "Hide"
                                    : "Show"}{" "}
                                  Reasoning
                                  {expandedReasonings[message.id] ? (
                                    <ChevronUp size={16} className="ml-2" />
                                  ) : (
                                    <ChevronDown size={16} className="ml-2" />
                                  )}
                                </Button>
                              )}
                              <div className="flex items-center space-x-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                      >
                                        <ThumbsUp size={16} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Rate response positively</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                      >
                                        <ThumbsDown size={16} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Rate response negatively</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        onClick={() =>
                                          copyToClipboard(
                                            message.text!,
                                            message.id,
                                          )
                                        }
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                      >
                                        {copiedStates[message.id] ? (
                                          <Check
                                            size={16}
                                            className="text-green-500"
                                          />
                                        ) : (
                                          <Copy size={16} />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {copiedStates[message.id]
                                          ? "Copied!"
                                          : "Copy response"}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>

                          {expandedReasonings[message.id] &&
                            message.reasoning && (
                              <AnimatePresence>
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-2 p-2 bg-muted rounded-md overflow-x-auto">
                                    <div className="min-w-[400px]">
                                      <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        className="prose dark:prose-invert text-sm"
                                        components={{
                                          table: (props) => (
                                            <div className="overflow-x-auto my-8">
                                              <table
                                                className="min-w-full divide-y divide-gray-200 bg-background"
                                                {...props}
                                              />
                                            </div>
                                          ),
                                          th: (props) => (
                                            <th
                                              className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                                              {...props}
                                            />
                                          ),
                                          td: (props) => (
                                            <td
                                              className="px-6 py-4 dark:bg-gray-900 whitespace-nowrap text-sm text-gray-500 dark:text-white"
                                              {...props}
                                            />
                                          ),
                                          code: (props) => (
                                            <code
                                              {...props}
                                              className="break-all whitespace-pre-wrap"
                                            />
                                          ),
                                          pre: (props) => (
                                            <pre
                                              {...props}
                                              className="overflow-x-auto"
                                            />
                                          ),
                                        }}
                                      >
                                        {message.reasoning}
                                      </ReactMarkdown>
                                    </div>
                                  </div>
                                </motion.div>
                              </AnimatePresence>
                            )}
                        </motion.div>
                      )}
                      {message.type === "chart" && message.chart && (
                        <div className="p-4 w-full shadow-sm">
                          <ChartComponent chartData={message.chart} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-background text-secondary-foreground p-4 rounded-lg animate-pulse">
                {thinkingMessage}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full space-x-2">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:text-primary hover:bg-background"
          >
            <Paperclip size={18} />
          </Button>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1 min-h-[40px] max-h-[200px] bg-white resize-none"
            disabled={!conversation}
            rows={1}
          />
          <Button
            onClick={handleSend}
            variant="outline"
            className="items-center justify-center text-primary hover:text-white hover:bg-primary"
            disabled={!conversation}
          >
            <ArrowUp size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
