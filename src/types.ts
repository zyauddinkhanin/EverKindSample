export type JournalItem = {
  type: "title" | "user" | "ai";
  text: string;
};

export interface ChatBubbleProps {
  text: string;
  isAI: boolean;
  delay: number;
}

export interface JournalCardProps {
  data: JournalItem[];
  onSave: () => void;
  cardTranslateX: number;
  isTyping: boolean;
}

export interface JournalInputProps {
  currentText: string;
  onTextChange: (text: string) => void;
  onSend: () => void;
}
