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
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const bubbleStyles = isAI ? styles.aiBubble : styles.userBubble;
  const bubbleTextStyles = isAI ? styles.aiBubbleText : styles.userBubbleText;

  const BubbleContent = (
    <View style={[styles.chatBubble, bubbleStyles]}>
      <Text style={bubbleTextStyles}>{text}</Text>
    </View>
  );

  return (
    <Animated.View style={[styles.bubbleWrapper, animatedStyle]}>
      {isAI ? (
        <LinearGradient
          colors={[COLORS.bubbleGradientStart, COLORS.bubbleGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBubble}
        >
          <Text style={styles.aiBubbleText}>{text}</Text>
        </LinearGradient>
      ) : (
        BubbleContent
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubbleWrapper: {
    marginBottom: 15,
  },
  chatBubble: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    maxWidth: "85%",
  },
  userBubble: {
    alignSelf: "flex-start",
    paddingHorizontal: 0,
    paddingVertical: 5,
  },
  gradientBubble: {
    alignSelf: "flex-start",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  aiBubble: {},
  userBubbleText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textPrimary,
  },
  aiBubbleText: {
    fontSize: 16,
    lineHeight: 24,
    color: "white",
  },
});

export default AnimatedChatBubble;
