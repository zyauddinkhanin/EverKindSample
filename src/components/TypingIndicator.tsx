import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withDelay,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/Colors";

const DOT_SIZE = 8;
const ANIMATION_DURATION = 400;

const Dot: React.FC<{ delay: number }> = ({ delay }) => {
  const offsetY = useSharedValue(0);

  React.useEffect(() => {
    offsetY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-4, {
            duration: ANIMATION_DURATION,
            easing: Easing.out(Easing.ease),
          }),
          withTiming(0, {
            duration: ANIMATION_DURATION,
            easing: Easing.in(Easing.ease),
          })
        ),
        -1,
        true
      )
    );
  }, [offsetY, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offsetY.value }],
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const TypingIndicator: React.FC = () => {
  return (
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
      style={styles.typingBubble}
    >
      <View style={styles.dotContainer}>
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  typingBubble: {
    alignSelf: "flex-start",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    maxWidth: "50%",
    marginBottom: 15,
  },
  dotContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: DOT_SIZE * 2,
    justifyContent: "space-around",
    width: 40,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "white",
    marginHorizontal: 2,
  },
});

export default TypingIndicator;
