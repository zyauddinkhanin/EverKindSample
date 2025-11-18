import { Platform, Dimensions } from "react-native";

export const isIOS = Platform.OS === "ios";
export const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
