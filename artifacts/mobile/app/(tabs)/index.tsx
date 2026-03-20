import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
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
import Colors from "@/constants/colors";
import { Category, useGame } from "@/contexts/GameContext";
import { AGE_CONFIG, AGE_STYLES_MAP } from "@/utils/ageStyles";

const ALL_CATEGORIES: Array<{
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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { stats, age, isLoading } = useGame();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? Math.max(insets.top + 67, 80) : insets.top;

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && age === null) {
        router.replace("/age-select");
      }
    }, [age, isLoading])
  );

  if (isLoading || age === null) return null;

  const ageStyle = AGE_STYLES_MAP[age] ?? { emoji: "🌟", accent: Colors.light.tint };
  const cfg = AGE_CONFIG[age];
  const availableCategories = ALL_CATEGORIES.filter((c) =>
    cfg.availableCategories.includes(c.category)
  );

  const accuracy =
    stats.totalAttempted > 0
      ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100)
      : 0;

  const handleCategory = (category: Category) => {
    router.push({ pathname: "/quiz/[category]", params: { category } });
  };

  const handleChangeAge = () => {
    router.push("/age-select");
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
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hello, Math Star! {ageStyle.emoji}</Text>
            <Text style={styles.subtitle}>{cfg.description}</Text>
          </View>
          <View style={styles.starsContainer}>
            <Ionicons name="star" size={16} color="#F59E0B" />
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
            <Ionicons name="flame" size={16} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.streakCurrent}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.ageBanner}>
        <View style={styles.ageBannerLeft}>
          <View style={[styles.ageBadge, { backgroundColor: ageStyle.bg }]}>
            <Text style={styles.ageBadgeEmoji}>{ageStyle.emoji}</Text>
          </View>
          <View>
            <Text style={styles.ageBannerLabel}>Playing as</Text>
            <Text style={styles.ageBannerAge}>Age {age}</Text>
          </View>
        </View>
        <Pressable
          onPress={handleChangeAge}
          style={({ pressed }) => [styles.changeAgeBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="pencil" size={14} color={Colors.light.tint} />
          <Text style={styles.changeAgeText}>Change</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose a Topic</Text>
        {availableCategories.map((cat) => (
          <CategoryCard
            key={cat.category}
            {...cat}
            onPress={() => handleCategory(cat.category)}
            completed={stats.categoriesCompleted.includes(cat.category)}
          />
        ))}
      </View>

      <View style={{ height: isWeb ? 120 : 100 }} />
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
    gap: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Inter_400Regular",
    marginTop: 3,
    lineHeight: 18,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 5,
    flexShrink: 0,
  },
  starsCount: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
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
  ageBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  ageBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ageBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ageBadgeEmoji: {
    fontSize: 22,
  },
  ageBannerLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  ageBannerAge: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    fontFamily: "Inter_700Bold",
  },
  changeAgeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  changeAgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.tint,
    fontFamily: "Inter_600SemiBold",
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
});
