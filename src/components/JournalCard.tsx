import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { GradientTextProps, JournalCardProps } from "../types";
import AnimatedChatBubble from "./AnimatedChatBubble";
import TypingIndicator from "./TypingIndicator";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaskedView from "@react-native-masked-view/masked-view";
import ChatIcon from "../../assets/ChatIcon";
import moment from "moment";

export const SaveJournalButton: React.FC<{ onPress: () => void }> = ({
  onPress,
}) => (
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
    style={styles.gradientButton}
  >
    <TouchableOpacity onPress={onPress} style={styles.saveButtonContainer}>
      <GradientText
        colors={[
          COLORS.bubbleGradientStart,
          COLORS.bubbleGradientMidStart,
          COLORS.bubbleGradientMidEnd,
          COLORS.bubbleGradientEnd,
        ]}
      >
        <Text style={styles.saveButtonText} allowFontScaling={false}>
          Save journal{"  "}
        </Text>
        <Feather name="check" size={16} color={COLORS.bubbleGradientEnd} />
      </GradientText>
    </TouchableOpacity>
  </LinearGradient>
);

const GradientText = ({ children, colors, ...rest }: GradientTextProps) => {
  return (
    <MaskedView
      maskElement={
        <Text allowFontScaling={false} {...rest}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0.29, y: 0 }}
        end={{ x: 0.78, y: 2.09 }}
        locations={[0, 0.25, 0.56, 0.9]}
      >
        <Text
          allowFontScaling={false}
          {...rest}
          style={[rest.style, { opacity: 0 }]}
        >
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

export const DatePill: React.FC<{ date: string }> = ({ date }) => (
  <View style={styles.datePillContainer}>
    <Text style={styles.datePillText} allowFontScaling={false}>
      {date}
    </Text>
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
export const BottomView: React.FC<JournalCardProps> = ({
  data,
  onSave,
  isShowBack,
  goBack,
  style,
}) => (
  <View key="save-button" style={[styles.bottomViewStyle, style]}>
    {isShowBack ? <GoBackButton onPress={goBack} /> : <View />}
    {data?.length > 0 ? <SaveJournalButton onPress={onSave} /> : <View />}
  </View>
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
  const formattedDate = moment().format("MMM Do YYYY");
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
    })
    .activeOffsetX([-20, 20])
    .failOffsetY([-5, 5]);

  const scrollRef = useRef<ScrollView>(null);
  const scrollParentRef = useRef<ScrollView>(null);
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
    scrollParentRef.current?.scrollToEnd();
  }, [data, isTyping]);

  const renderContent = () => {
    const content = [];
    data.forEach((item, index) => {
      if (item.type === "title") {
        content.push(
          <Text
            key={index}
            style={styles.journalTitle}
            allowFontScaling={false}
          >
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
    return content;
  };

  return (
    <View style={styles.cardWrapper}>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <ImageBackground
            source={require("../../assets/BgImage.png")}
            resizeMode="cover"
            style={styles.cardContentGradient}
            imageStyle={{ opacity: 0.05 }}
          >
            {data?.length > 0 ? (
              <View style={styles.cardContentGradient}>
                <ScrollView
                  ref={scrollParentRef}
                  nestedScrollEnabled={true}
                  style={styles.scrollView}
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                  {data?.length > 0 ? (
                    <Text style={styles.journalTitle} allowFontScaling={false}>
                      {title}
                    </Text>
                  ) : null}
                  <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={styles.scrollContent}
                    style={[styles.scrollView, styles.invertedTransform]}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    <View style={styles.contentTransform}>
                      {renderContent()}
                    </View>
                  </ScrollView>
                </ScrollView>
                <BottomView
                  key={Math.random()}
                  goBack={goBack}
                  onSave={onSave}
                  data={data}
                  isShowBack={isShowBack}
                  isTyping={false}
                  cardTranslateX={null}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 30,
                    paddingTop: 0,
                  }}
                />
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 50,
                  }}
                >
                  <ChatIcon style={{ marginTop: 100, marginBottom: 15 }} />
                  <Text style={styles.emptyTitle} allowFontScaling={false}>
                    Keep the streak 🚀
                  </Text>
                  <Text style={styles.emptyDesc} allowFontScaling={false}>
                    You can start as many journals you want, EverKind will let
                    you know when they’re ready to be saved.
                  </Text>
                </View>
                <BottomView
                  key={Math.random()}
                  goBack={goBack}
                  onSave={onSave}
                  data={data}
                  isShowBack={isShowBack}
                  isTyping={false}
                  cardTranslateX={null}
                  style={{ paddingHorizontal: 20, paddingVertical: 30 }}
                />
              </View>
            )}
          </ImageBackground>
          {data?.length > 0 ? <DatePill date={formattedDate} /> : null}
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
    borderRadius: 24,
    shadowColor: "#100212E5",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 7,
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
    paddingTop: 0,
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  datePillContainer: {
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.07)",
    position: "absolute",
    top: -15,
    transform: [{ rotate: "-3deg" }],
    shadowColor: "#100212E5",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  datePillText: {
    fontSize: 14,
    fontFamily: "SemiBold",
    color: "#100212E5",
  },
  journalTitle: {
    fontSize: 16,
    fontFamily: "Medium",
    color: "#1C191C",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
  gradientButton: {
    padding: 2,
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
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Medium",
    marginRight: 5,
  },
  inputIcon: {
    marginHorizontal: 5,
    backgroundColor: "#e5e0e8",
    padding: 5,
    borderRadius: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: "Medium",
    color: "#100212E5",
    lineHeight: 24,
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: "#1002128C",
    textAlign: "center",
    fontFamily: "Regular",
    marginTop: 10,
  },
  bottomViewStyle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});

export default JournalCard;
