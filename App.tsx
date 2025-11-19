import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { JournalItem } from "./src/types";
import JournalCard, { DatePill } from "./src/components/JournalCard";
import JournalInput from "./src/components/JournalInput";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MenuIcon from "./assets/MenuIcon";
import moment from "moment";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

const initialJournalData: JournalItem[] = [
  { type: "user", text: "I sold my wife’s car today" },
  {
    type: "ai",
    text: "What led you to make this decision? How are you feeling about selling it?",
  },
];

const randomReplies = [
  "That sounds like a significant moment! How did that make you feel?",
  "What a great day! Can you tell me more about what inspired that?",
  "That’s an interesting detail. Is there anything else about that experience you’d like to explore?",
  "It sounds like you handled that well. What did you learn from that situation?",
  "I see. What is the next thing you plan to do related to this?",
];

const Header = () => (
  <View style={styles.header}>
    <MenuIcon />
    <Text style={styles.headerTitle} allowFontScaling={false}>
      EverKind
    </Text>
    <Image
      source={{
        uri: "https://i.imgur.com/8N4N5R8.png",
      }}
      style={styles.profileImage}
    />
  </View>
);

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [journalData, setJournalData] =
    useState<JournalItem[]>(initialJournalData);
  const [title, setTitle] = useState("I sold my wife’s car today");
  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const formattedDate = moment().format("MMM Do YYYY");

  const [chatKey, setChatKey] = useState<number>(0);
  const cardTranslateX = useSharedValue(0);

  const [previousJournalData, setPreviousJournalData] = useState<JournalItem[]>(
    []
  );
  const [showPreviousCard, setShowPreviousCard] = useState(false);
  const prevCardTranslateX = useSharedValue(500);

  const [fontsLoaded] = useFonts({
    Bold: require("./assets/fonts/InstrumentSans-Bold.ttf"),
    Italic: require("./assets/fonts/InstrumentSans-Italic.ttf"),
    Medium: require("./assets/fonts/InstrumentSans-Medium.ttf"),
    Regular: require("./assets/fonts/InstrumentSans-Regular.ttf"),
    SemiBold: require("./assets/fonts/InstrumentSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const handleSaveJournal = () => {
    setPreviousJournalData(journalData);
    cardTranslateX.value = withTiming(-500, {
      duration: 350,
      easing: Easing.out(Easing.ease),
    });
    setTimeout(() => {
      setJournalData([]);
      setTitle("");
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
      setTitle(
        previousJournalData?.length > 0 ? previousJournalData[0]?.text : ""
      );
      setPreviousJournalData([null]);
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

    if (journalData?.length === 0) {
      setTitle(inputText.trim());
    }

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.fullScreenBackground}>
      <ImageBackground
        source={require("./assets/gradient.png")}
        style={styles.fullScreenBackground}
      >
        <SafeAreaProvider>
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
                title={title}
                isShowBack={showPreviousCard}
                goBack={handleGoBack}
              />
              {journalData?.length > 0 ? (
                <DatePill date={formattedDate} />
              ) : null}
              <JournalInput
                currentText={inputText}
                onTextChange={setInputText}
                onSend={handleSendMessage}
              />
            </KeyboardAvoidingView>
          </SafeAreaView>
        </SafeAreaProvider>
      </ImageBackground>
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
    fontFamily: "Medium",
    color: "#100212E5",
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
