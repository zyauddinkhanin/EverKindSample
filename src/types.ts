import { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";

export type JournalItem = {
  id: string | number;
  type: "title" | "user" | "ai";
  text: string;
};

export interface ChatBubbleProps {
  id: string | number;
  text: string;
  isAI: boolean;
  delay: number;
}

export interface JournalCardProps {
  data: JournalItem[];
  onSave: () => void;
  cardTranslateX: SharedValue<number>;
  isTyping: boolean;
  title?: string;
  isShowBack?: boolean;
  goBack: () => void;
  style?: ViewStyle;
}

export interface JournalInputProps {
  currentText: string;
  onTextChange: (text: string) => void;
  onSend: () => void;
}

export interface GradientTextProps {
  children: ReactNode;
  colors: [string, string, ...string[]];
  style?: StyleProp<TextStyle>;
}
