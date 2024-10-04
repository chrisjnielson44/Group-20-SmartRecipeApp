'use client';

import { useEffect, useState } from 'react';
import { getChatResponse } from '@/utils/openai';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { X } from 'lucide-react';

export function Chat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string, isUser: boolean }[]>([]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage = { text: input, isUser: true };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        try {
            const aiReply = await getChatResponse([...messages, userMessage]);
            const aiMessage = { text: aiReply, isUser: false };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error getting AI response:', error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    };

    const handleOpenChange = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setMessages([]);
        }
    };

    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        } else {
            document.removeEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    return (
        <>
            <Button variant="outline" size="icon" onClick={handleOpenChange}>
                <p className="font-bold">AI</p>
            </Button>
            {isOpen && (
                <div className="fixed top-0 right-0 h-full w-[500px] z-50 bg-background shadow-lg border-l-2 rounded-xl">
                    <div className="flex flex-col h-full">
                        <div className="p-3 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl text-primary font-bold">Eliza</h2>
                            <Button variant="outline" size="icon" onClick={handleOpenChange} className={"text-gray-500 hover:text-red-500"}>
                                <X/>
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="chat-messages flex flex-col space-y-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-lg max-w-xs ${message.isUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
                                    >
                                        {message.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="chat-input p-4 flex space-x-3 border-t">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className="flex-1"
                            />
                            <Button onClick={handleSend}>Send</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
