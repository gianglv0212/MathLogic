import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryCard } from "@/components/CategoryCard";
import { StarRating } from "@/components/StarRating";
import Colors from "@/constants/colors";
import { Category, useGame } from "@/contexts/GameContext";
import { Difficulty } from "@/contexts/GameContext";

const categories: Array<{
  category: Category;
  label: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  iconColor: string;
}> = [
  {
    category: "addition",
    label: "Addition",
    description: "Add numbers together",
    iconName: "add-circle",
    bgColor: "#EEF2FF",
    iconColor: Colors.light.tint,
  },
  {
    category: "subtraction",
    label: "Subtraction",
    description: "Take numbers away",
    iconName: "remove-circle",
    bgColor: "#FEF3C7",
    iconColor: "#D97706",
  },
  {
    category: "multiplication",
    label: "Multiplication",
    description: "Multiply like a pro",
    iconName: "close-circle",
    bgColor: "#D1FAE5",
    iconColor: Colors.light.correct,
  },
  {
    category: "logic",
    label: "Logic Puzzles",
    description: "Solve word problems",
    iconName: "bulb",
    bgColor: "#FCE7F3",
    iconColor: Colors.light.accentPink,
  },
  {
    category: "patterns",
    label: "Patterns",
    description: "Spot the sequence",
    iconName: "infinite",
    bgColor: "#FEE2E2",
    iconColor: Colors.light.incorrect,
  },
];

const difficulties: { key: Difficulty; label: string; color: string }[] = [
  { key: "easy", label: "Easy", color: Colors.light.correct },
  { key: "medium", label: "Medium", color: Colors.light.warning },
  { key: "hard", label: "Hard", color: Colors.light.incorrect },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { stats, difficulty, setDifficulty } = useGame();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? Math.max(insets.top + 67, 80) : insets.top;

  const accuracy =
    stats.totalAttempted > 0
      ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100)
      : 0;

  const handleCategory = (category: Category) => {
    router.push({ pathname: "/quiz/[category]", params: { category } });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: topPad }]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#4F46E5", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, Math Star!</Text>
            <Text style={styles.subtitle}>Ready for a challenge?</Text>
          </View>
          <View style={styles.starsContainer}>
            <Ionicons name="star" size={18} color="#F59E0B" />
            <Text style={styles.starsCount}>{stats.stars}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalCorrect}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="flame" size={18} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.streakCurrent}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Difficulty</Text>
        <View style={styles.difficultyRow}>
          {difficulties.map((d) => (
            <Pressable
              key={d.key}
              onPress={() => setDifficulty(d.key)}
              style={({ pressed }) => [
                styles.diffBtn,
                difficulty === d.key && {
                  backgroundColor: d.color,
                  borderColor: d.color,
                },
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text
                style={[
                  styles.diffBtnText,
                  difficulty === d.key && styles.diffBtnTextActive,
                ]}
              >
                {d.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose a Topic</Text>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.category}
            {...cat}
            onPress={() => handleCategory(cat.category)}
            completed={stats.categoriesCompleted.includes(cat.category)}
          />
        ))}
      </View>

      <View style={[styles.bottomPad, { height: isWeb ? 120 : 100 }]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flexGrow: 1,
  },
  header: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    padding: 20,
    marginBottom: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 5,
  },
  starsCount: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  difficultyRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },
  diffBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: "center",
    backgroundColor: Colors.light.card,
  },
  diffBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.textSecondary,
    fontFamily: "Inter_600SemiBold",
  },
  diffBtnTextActive: {
    color: "#fff",
  },
  bottomPad: {},
});
