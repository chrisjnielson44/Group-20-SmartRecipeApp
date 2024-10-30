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

export interface Message {
  id: string;
  text?: string;
  isUser: boolean;
  isTyping?: boolean;
  reasoning?: string;
  chart?: ChartData;
  type: "text" | "chart";
}

export interface Conversation {
  id: string;
  title: string;
}

export interface ChatAgentProps {
  selectedDatabase: string | null;
  conversation: Conversation | null;
  onUpdateConversationTitle: (
    conversationId: string,
    newTitle: string,
  ) => Promise<void>;
}

// Types for API and Prisma handling
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | Date
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface FastAPIResponse {
  reply: string;
  reasoning?: string;
  chart?: ChartData;
}
