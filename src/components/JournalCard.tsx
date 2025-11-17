import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { JournalCardProps } from "../types";
import AnimatedChatBubble from "./AnimatedChatBubble";
import TypingIndicator from "./TypingIndicator";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from "react-native-reanimated";

const SaveJournalButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.saveButtonContainer}>
    <Text style={styles.saveButtonText}>Save journal</Text>
    <Feather name="check" size={18} color="white" />
  </TouchableOpacity>
);

const DatePill: React.FC<{ date: string }> = ({ date }) => (
  <View style={styles.datePillContainer}>
    <Text style={styles.datePillText}>{date}</Text>
  </View>
);

const JournalCard: React.FC<JournalCardProps> = ({
  data,
  onSave,
  cardTranslateX,
  isTyping,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(cardTranslateX) }],
    };
  });

  let bubbleIndex = 0;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [data, isTyping]);

  return (
    <View style={styles.cardWrapper}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <LinearGradient
          colors={[COLORS.cardGradientStart, COLORS.cardGradientEnd]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.cardContentGradient}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: true })
            }
          >
            <DatePill date="Nov 2nd 2025" />

            {data.map((item, index) => {
              if (item.type === "title") {
                return (
                  <Text key={index} style={styles.journalTitle}>
                    {item.text}
                  </Text>
                );
              }
              const delay = bubbleIndex * 150;
              bubbleIndex++;

              return (
                <AnimatedChatBubble
                  key={index}
                  text={item.text}
                  isAI={item.type === "ai"}
                  delay={delay}
                />
              );
            })}
            {isTyping && <TypingIndicator />}
            <View style={{ alignItems: "flex-end", marginTop: 15 }}>
              <SaveJournalButton onPress={onSave} />
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContentGradient: {
    flex: 1,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: 15,
  },
  card: {
    flex: 1,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
    backgroundColor: COLORS.cardBackground,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  datePillContainer: {
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  datePillText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  journalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  saveButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.saveButton,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: COLORS.saveButton,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default JournalCard;
