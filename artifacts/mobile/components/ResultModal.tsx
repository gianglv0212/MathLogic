import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "@/constants/colors";

interface ResultModalProps {
  visible: boolean;
  correct: boolean;
  explanation: string;
  streakCount: number;
  onNext: () => void;
}

export function ResultModal({ visible, correct, explanation, streakCount, onNext }: ResultModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }).start();
      if (correct) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [visible, correct, scaleAnim]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.sheet, { transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.iconBg, { backgroundColor: correct ? "#D1FAE5" : "#FEE2E2" }]}>
            <Ionicons
              name={correct ? "checkmark-circle" : "close-circle"}
              size={56}
              color={correct ? Colors.light.correct : Colors.light.incorrect}
            />
          </View>

          <Text style={[styles.title, { color: correct ? Colors.light.correct : Colors.light.incorrect }]}>
            {correct ? "Correct!" : "Not quite!"}
          </Text>

          {correct && streakCount > 1 && (
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={16} color="#F59E0B" />
              <Text style={styles.streakText}>{streakCount} in a row!</Text>
            </View>
          )}

          <Text style={styles.explanation}>{explanation}</Text>

          <Pressable
            onPress={onNext}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: correct ? Colors.light.correct : Colors.light.tint, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={styles.buttonText}>Next Question</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    padding: 28,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  iconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 8,
    gap: 4,
  },
  streakText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#D97706",
    fontFamily: "Inter_600SemiBold",
  },
  explanation: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: "Inter_400Regular",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: "100%",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
