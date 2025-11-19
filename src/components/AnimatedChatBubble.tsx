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
            {text}
          </Text>
        </LinearGradient>
      ) : (
        <View style={styles.userBubbleContainer}>
          <Text style={styles.userBubbleText} allowFontScaling={false}>
            {text}
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
    shadowColor: "#100212E5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 5,
  },
  aiBubbleText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#100212E5",
    fontFamily: "Regular",
  },
  userBubbleContainer: {
    paddingVertical: 8,
    maxWidth: "100%",
  },
  userBubbleText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#100212E5",
    textAlign: "left",
    fontFamily: "Regular",
  },
});

export default AnimatedChatBubble;
