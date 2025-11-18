import React, { useEffect } from "react";
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

const AnimatedChatBubble = ({ text, isAI, delay }: ChatBubbleProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 350 }));
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

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
          colors={[COLORS.bubbleGradientStart, COLORS.bubbleGradientEnd]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 1, 1]}
          style={styles.gradientBubble}
        >
          <Text style={styles.aiBubbleText}>{text}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.userBubbleContainer}>
          <Text style={styles.userBubbleText}>{text}</Text>
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
  },
  userWrapper: {
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  gradientBubble: {
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    maxWidth: "100%",
  },
  aiBubbleText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  userBubbleContainer: {
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 8,
    maxWidth: "100%",
  },
  userBubbleText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textPrimary,
    textAlign: "left",
  },
});

export default AnimatedChatBubble;
