import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import {
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "./src/constants/Colors";
import { JournalItem } from "./src/types";
import JournalCard, { DatePill } from "./src/components/JournalCard";
import JournalInput from "./src/components/JournalInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const initialJournalData: JournalItem[] = [
  { type: "user", text: "I sold my wife’s car today" },
  {
    type: "ai",
    text: "What led you to make this decision? How are you feeling about selling it?",
  },
  {
    type: "user",
    text: "It feels great, we found a sweet deal and ended up getting a new car right away",
  },
  {
    type: "ai",
    text: "Sounds like you both are feeling positive about the car change. What makes the new car special to your wife?",
  },
];

const randomReplies = [
  "That sounds like a significant moment! How did that make you feel?",
  "What a great day! Can you tell me more about what inspired that?",
  "That’s an interesting detail. Is there anything else about that experience you’d like to explore?",
  "It sounds like you handled that well. What did you learn from that situation?",
  "I see. What is the next thing you plan to do related to this?",
];

const emptyJournalData: JournalItem[] = [
  { type: "ai", text: "Keep the streak 🚀" },
  {
    type: "user",
    text: "You can start as many journals you want, EverKind will let you know when they’re ready to be saved.",
  },
];

const Header = () => (
  <View style={styles.header}>
    <Feather name="menu" size={24} color={COLORS.textPrimary} />
    <Text style={styles.headerTitle}>EverKind</Text>
    <Image
      source={{
        uri: "https://i.imgur.com/8N4N5R8.png",
      }}
      style={styles.profileImage}
    />
  </View>
);

const App = () => {
  const [journalData, setJournalData] =
    useState<JournalItem[]>(initialJournalData);
  const cardScale = useSharedValue(1);
  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [chatKey, setChatKey] = useState<number>(0);
  const cardTranslateX = useSharedValue(0);

  const [previousJournalData, setPreviousJournalData] = useState(null);
  const [showPreviousCard, setShowPreviousCard] = useState(false);
  const prevCardTranslateX = useSharedValue(500);

  const Easing = require("react-native-reanimated").Easing;

  const handleSaveJournal = () => {
    setPreviousJournalData(journalData);
    cardTranslateX.value = withTiming(-500, {
      duration: 350,
      easing: Easing.out(Easing.ease),
    });
    setTimeout(() => {
      setJournalData(emptyJournalData);
      cardTranslateX.value = 500;
      setShowPreviousCard(true);
      cardTranslateX.value = withTiming(0, {
        duration: 350,
        easing: Easing.out(Easing.ease),
      });
      prevCardTranslateX.value = withTiming(0, {
        duration: 350,
        easing: Easing.out(Easing.ease),
      });
      setChatKey((prevKey) => prevKey + 1);
    }, 450);
  };

  const handleGoBack = () => {
    prevCardTranslateX.value = withTiming(500, {
      duration: 350,
      easing: Easing.in(Easing.ease),
    });

    cardTranslateX.value = withTiming(500, {
      duration: 350,
      easing: Easing.out(Easing.ease),
    });

    setTimeout(() => {
      setJournalData(previousJournalData);
      setPreviousJournalData(null);
      setShowPreviousCard(false);
      prevCardTranslateX.value = 500;
      cardTranslateX.value = -500;
      cardTranslateX.value = withTiming(0, {
        duration: 350,
        easing: Easing.out(Easing.ease),
      });
    }, 350);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: JournalItem = { type: "user", text: inputText.trim() };

    setJournalData((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    const thinkingTime = Math.max(2000, Math.random() * 800 + 400);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * randomReplies.length);
      const aiReply: JournalItem = {
        type: "ai",
        text: randomReplies[randomIndex],
      };
      setIsTyping(false);
      setJournalData((prev) => [...prev, aiReply]);
    }, thinkingTime);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          COLORS.backgroundStart,
          COLORS.bubbleGradientStart,
          COLORS.bubbleGradientEnd,
        ]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 1, 1]}
        style={styles.fullScreenBackground}
      >
        <SafeAreaView style={styles.container}>
          <Header />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.fullScreenBackground}
          >
            <JournalCard
              key={chatKey}
              data={journalData}
              onSave={handleSaveJournal}
              cardTranslateX={cardTranslateX}
              isTyping={isTyping}
              title={"Selling wife’s car"}
              isShowBack={showPreviousCard}
              goBack={handleGoBack}
            />
            <DatePill date="Nov 2nd 2025" />
            <JournalInput
              currentText={inputText}
              onTextChange={setInputText}
              onSend={handleSendMessage}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  fullScreenBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "400",
    color: COLORS.textPrimary,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#fff",
  },
});

export default App;
