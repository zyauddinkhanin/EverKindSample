import React from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { JournalInputProps } from "../types";

const JournalInput = ({
  currentText,
  onTextChange,
  onSend,
}: JournalInputProps) => {
  return (
    <View style={styles.journalInputContainer}>
      <Ionicons
        name="camera-outline"
        size={24}
        color={COLORS.textSecondary}
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.journalInput}
        placeholder="What did you do today?"
        placeholderTextColor={COLORS.textSecondary}
        value={currentText}
        onChangeText={onTextChange}
        returnKeyType="send"
        onSubmitEditing={onSend}
      />

      <Pressable onPress={onSend}>
        <MaterialCommunityIcons
          name={currentText.trim() ? "send" : "microphone"}
          size={24}
          color={currentText.trim() ? COLORS.headerColor : COLORS.textSecondary}
          style={styles.inputIcon}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  journalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  journalInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginHorizontal: 5,
  },
});

export default JournalInput;
