import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { JournalCardProps } from "../types";
import AnimatedChatBubble from "./AnimatedChatBubble";
import TypingIndicator from "./TypingIndicator";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";

export const SaveJournalButton: React.FC<{ onPress: () => void }> = ({
  onPress,
}) => (
  <LinearGradient
    colors={[COLORS.bubbleGradientStart, COLORS.bubbleGradientEnd]}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 0 }}
    locations={[0, 1]}
    style={styles.gradientButton}
  >
    <TouchableOpacity onPress={onPress} style={styles.saveButtonContainer}>
      <Text style={styles.saveButtonText}>Save journal</Text>
      <Feather name="check" size={18} color={COLORS.bubbleGradientEnd} />
    </TouchableOpacity>
  </LinearGradient>
);

export const DatePill: React.FC<{ date: string }> = ({ date }) => (
  <View style={styles.datePillContainer}>
    <Text style={styles.datePillText}>{date}</Text>
  </View>
);

export const GoBackButton: React.FC<{ onPress: () => void }> = ({
  onPress,
}) => (
  <Pressable onPress={onPress}>
    <View
      style={{
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: COLORS.textSecondary,
      }}
    >
      <Ionicons name="chevron-back" size={20} color={COLORS.textPrimary} />
    </View>
  </Pressable>
);

const JournalCard: React.FC<JournalCardProps> = ({
  data,
  onSave,
  cardTranslateX,
  isTyping,
  title,
  isShowBack,
  goBack,
}) => {
  const SWIPE_THRESHOLD = 120;

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      cardTranslateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(onSave)();
      } else if (event.translationX > SWIPE_THRESHOLD && isShowBack) {
        runOnJS(goBack)();
      } else {
        cardTranslateX.value = withTiming(0, { duration: 250 });
      }
    });

  const scrollRef = useRef<ScrollView>(null);
  const animatedStyle = useAnimatedStyle(() => {
    const rotate = cardTranslateX.value / 30;

    return {
      transform: [
        { translateX: cardTranslateX.value },
        { rotateZ: `${rotate}deg` },
      ],
    };
  });

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [data, isTyping]);

  const renderContent = () => {
    const content = [];
    data.forEach((item, index) => {
      if (item.type === "title") {
        content.push(
          <Text key={index} style={styles.journalTitle}>
            {item.text}
          </Text>
        );
      } else {
        content.push(
          <AnimatedChatBubble
            key={index}
            text={item.text}
            isAI={item.type === "ai"}
            delay={item.type === "ai" ? 150 : 0}
          />
        );
      }
    });
    if (isTyping) {
      content.push(<TypingIndicator key="typing-indicator" />);
    }
    content.push(
      <View
        key="save-button"
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        {isShowBack ? <GoBackButton onPress={goBack} /> : <View />}
        <SaveJournalButton onPress={onSave} />
      </View>
    );

    return content;
  };

  return (
    <View style={styles.cardWrapper}>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <LinearGradient
            colors={[COLORS.cardGradientStart, COLORS.cardGradientEnd]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.cardContentGradient}
          >
            <Text style={styles.journalTitle}>{title}</Text>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.scrollContent}
              style={[styles.scrollView, styles.invertedTransform]}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.contentTransform}>{renderContent()}</View>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>
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
    marginVertical: 20,
  },
  scrollView: {
    flex: 1,
  },
  invertedTransform: {
    transform: [{ scaleY: -1 }],
  },
  contentTransform: {
    transform: [{ scaleY: -1 }],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexGrow: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  datePillContainer: {
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 7,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.07)",
    position: "absolute",
    top: 5,
    zIndex: 99,
    elevation: 20,
    transform: [{ rotate: "-5deg" }],
  },
  datePillText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  journalTitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    color: COLORS.textPrimary,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
  gradientButton: {
    padding: 2,
    shadowColor: COLORS.saveButton,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 5,
    height: 34,
    overflow: "hidden",
    borderRadius: 30,
  },
  saveButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    borderRadius: 25,
    height: 30,
  },
  saveButtonText: {
    color: COLORS.bubbleGradientEnd,
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 5,
  },
  inputIcon: {
    marginHorizontal: 5,
    backgroundColor: "#e5e0e8",
    padding: 5,
    borderRadius: 30,
  },
});

export default JournalCard;
