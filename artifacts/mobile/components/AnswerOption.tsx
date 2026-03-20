import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/colors";

type OptionState = "default" | "selected" | "correct" | "incorrect";

interface AnswerOptionProps {
  label: string;
  state: OptionState;
  onPress: () => void;
  disabled?: boolean;
}

const stateConfig: Record<OptionState, { bg: string; border: string; text: string; icon?: keyof typeof Ionicons.glyphMap }> = {
  default: {
    bg: Colors.light.card,
    border: Colors.light.border,
    text: Colors.light.text,
  },
  selected: {
    bg: "#EEF2FF",
    border: Colors.light.tint,
    text: Colors.light.tint,
  },
  correct: {
    bg: "#D1FAE5",
    border: Colors.light.correct,
    text: Colors.light.correct,
    icon: "checkmark-circle",
  },
  incorrect: {
    bg: "#FEE2E2",
    border: Colors.light.incorrect,
    text: Colors.light.incorrect,
    icon: "close-circle",
  },
};

export function AnswerOption({ label, state, onPress, disabled }: AnswerOptionProps) {
  const config = stateConfig[state];

  const handlePress = () => {
    if (state === "default") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          opacity: pressed && !disabled ? 0.85 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
      ]}
    >
      <Text style={[styles.label, { color: config.text }]}>{label}</Text>
      {config.icon && (
        <Ionicons name={config.icon} size={22} color={config.text} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
