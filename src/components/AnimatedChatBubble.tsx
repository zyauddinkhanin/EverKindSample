import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { COLORS } from "../constants/Colors";
import { ChatBubbleProps } from "../types";
import { useTyping } from "../context/TypingContext";
import { useScroll } from "../context/ScrollContext";

const AnimatedChatBubble = ({ text, isAI, delay, id }: ChatBubbleProps) => {
  const { streamed, markStreamed } = useTyping();
  const messageId = id;
  const { scrollToEndRef } = useScroll();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  const [displayed, setDisplayed] = useState(
    isAI && !streamed[messageId] ? "" : text
  );

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 350 }));
  }, []);

  useEffect(() => {
    if (!isAI) return;
    if (streamed[messageId]) return;

    let i = 0;

    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        scrollToEndRef.current?.scrollToEnd({ animated: true });
        i++;
      } else {
        clearInterval(interval);
        markStreamed(`${messageId}`);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bubbleWrapper,
        animatedStyle,
        isAI ? styles.aiWrapper : styles.userWrapper,
      ]}
    >
      {isAI ? (
        <LinearGradient
          colors={[
            COLORS.bubbleGradientStart,
            COLORS.bubbleGradientMidStart,
            COLORS.bubbleGradientMidEnd,
            COLORS.bubbleGradientEnd,
          ]}
          start={{ x: 0.29, y: 0 }}
          end={{ x: 0.78, y: 2.09 }}
          locations={[0, 0.25, 0.56, 0.9]}
          style={styles.gradientBubble}
        >
          <Text style={styles.aiBubbleText} allowFontScaling={false}>
            {displayed}
          </Text>
        </LinearGradient>
      ) : (
        <View style={styles.userBubbleContainer}>
          <Text style={styles.userBubbleText} allowFontScaling={false}>
            {displayed}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubbleWrapper: {
    marginBottom: 15,
  },
  aiWrapper: {
    alignItems: "flex-start",
    shadowColor: "#100212E5",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 7,
    borderRadius: 20,
  },
  userWrapper: {
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  gradientBubble: {
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 18,
    width: "100%",
    shadowColor: "#100212E5",
  },
  aiBubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#100212E5",
    fontFamily: "Regular",
  },
  userBubbleContainer: {
    paddingVertical: 8,
    width: "100%",
  },
  userBubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#100212E5",
    textAlign: "left",
    fontFamily: "Regular",
  },
});

export default AnimatedChatBubble;
