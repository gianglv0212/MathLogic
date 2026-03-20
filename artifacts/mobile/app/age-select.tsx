import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useGame } from "@/contexts/GameContext";
import { AGE_CONFIG, AGE_STYLES_MAP as AGE_STYLES } from "@/utils/ageStyles";

interface AgeCardProps {
  age: number;
  selected: boolean;
  onPress: () => void;
}

function AgeCard({ age, selected, onPress }: AgeCardProps) {
  const style = AGE_STYLES[age];
  const cfg = AGE_CONFIG[age];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && { borderColor: style.accent, borderWidth: 2.5 },
        { opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <View style={[styles.emojiCircle, { backgroundColor: style.bg }]}>
        <Text style={styles.emoji}>{style.emoji}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.ageLabel}>{cfg.label}</Text>
        <Text style={styles.ageDesc} numberOfLines={1}>{cfg.description}</Text>
        <View style={styles.tagRow}>
          {cfg.availableCategories.slice(0, 3).map((cat) => (
            <View key={cat} style={[styles.tag, { backgroundColor: style.bg }]}>
              <Text style={[styles.tagText, { color: style.accent }]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </View>
          ))}
          {cfg.availableCategories.length > 3 && (
            <View style={[styles.tag, { backgroundColor: style.bg }]}>
              <Text style={[styles.tagText, { color: style.accent }]}>
                +{cfg.availableCategories.length - 3}
              </Text>
            </View>
          )}
        </View>
      </View>
      {selected && (
        <Ionicons name="checkmark-circle" size={24} color={style.accent} />
      )}
    </Pressable>
  );
}

interface Props {
  isChanging?: boolean;
}

export default function AgeSelectScreen({ isChanging }: Props) {
  const insets = useSafeAreaInsets();
  const { age: currentAge, setAge } = useGame();
  const [selected, setSelected] = useState<number | null>(currentAge);
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? Math.max(insets.top + 67, 20) : insets.top + 16;
  const bottomPad = isWeb ? Math.max(insets.bottom + 34, 20) : insets.bottom + 16;

  const handleSelect = (age: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(age);
  };

  const handleConfirm = async () => {
    if (selected === null) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setAge(selected);
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.screen, { paddingTop: topPad }]}>
      <LinearGradient
        colors={["#4F46E5", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBanner}
      >
        <Text style={styles.headerEmoji}>🧮</Text>
        <Text style={styles.headerTitle}>
          {isChanging ? "Change Your Age" : "Welcome!"}
        </Text>
        <Text style={styles.headerSub}>
          {isChanging
            ? "Pick your current age to update the questions"
            : "How old are you? We'll make questions just for you!"}
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(AGE_CONFIG).map((ageKey) => {
          const age = Number(ageKey);
          return (
            <AgeCard
              key={age}
              age={age}
              selected={selected === age}
              onPress={() => handleSelect(age)}
            />
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPad }]}>
        <Pressable
          onPress={handleConfirm}
          disabled={selected === null}
          style={({ pressed }) => [
            styles.confirmBtn,
            selected === null && styles.confirmBtnDisabled,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={styles.confirmText}>
            {selected !== null
              ? `Start with Age ${selected}!`
              : "Select your age"}
          </Text>
          {selected !== null && (
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  scroll: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  emoji: {
    fontSize: 26,
  },
  cardContent: {
    flex: 1,
    gap: 3,
  },
  ageLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    fontFamily: "Inter_700Bold",
  },
  ageDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 2,
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    borderRadius: 16,
  },
  confirmBtnDisabled: {
    backgroundColor: Colors.light.border,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
