export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  type: "text";
  isTyping?: boolean;
  reasoning?: string;
}
