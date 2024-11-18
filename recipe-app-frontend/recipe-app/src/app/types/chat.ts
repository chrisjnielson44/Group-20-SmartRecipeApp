// Chart related types
export interface ChartDataPoint {
  [key: string]: string | number | Date;
}

export interface ChartData {
  data: ChartDataPoint[];
  x_column: string;
  y_column?: string;
  y_columns?: string[];
  chart_type: "line" | "bar";
  title?: string;
  description?: string;
  footer?: string;
}

// Message types for frontend display
export interface Message {
  id: string;
  text?: string;
  isUser: boolean;
  isTyping?: boolean;
  reasoning?: string;
  chart?: ChartData;
  type: "text" | "chart";
}

// Database model types
export interface DBMessage {
  id: string;
  content: string;
  role: string;
  reasoning?: string;
  chart?: ChartData;
  createdAt: Date;
  conversationId: string;
}

export interface Conversation {
  id: string;
  title: string;
}

// Component props
export interface ChatAgentProps {
  conversation: Conversation | null;
  onUpdateConversationTitle: (
      conversationId: string,
      newTitle: string,
  ) => Promise<void>;
}

// API types
export interface FastAPIResponse {
  reply: string;
  reasoning?: string;
  chart?: ChartData;
}

export interface ChatRequest {
  message: string;
  conversationId: string;
  conversation_history: Array<{
    role: string;
    content: string;
  }>;
}