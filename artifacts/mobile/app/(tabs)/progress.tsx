import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StatCard } from "@/components/StatCard";
import { StarRating } from "@/components/StarRating";
import Colors from "@/constants/colors";
import { useGame } from "@/contexts/GameContext";

const categoryLabels: Record<string, string> = {
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Multiplication",
  logic: "Logic Puzzles",
  patterns: "Patterns",
};

const categoryColors: Record<string, string> = {
  addition: Colors.light.tint,
  subtraction: "#D97706",
  multiplication: Colors.light.correct,
  logic: Colors.light.accentPink,
  patterns: Colors.light.incorrect,
};

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { stats, resetStats } = useGame();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? Math.max(insets.top + 67, 80) : insets.top;

  const accuracy =
    stats.totalAttempted > 0
      ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100)
      : 0;

  const starRating =
    accuracy >= 80 ? 3 : accuracy >= 50 ? 2 : stats.totalAttempted > 0 ? 1 : 0;

  const handleReset = () => {
    Alert.alert(
      "Reset Progress?",
      "This will clear all your scores and stars. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: resetStats,
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: topPad }]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#10B981", "#059669"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Progress</Text>
        <View style={styles.starRow}>
          <StarRating count={starRating} max={3} size={28} color="#FBBF24" />
        </View>
        <Text style={styles.headerSub}>
          {stats.totalAttempted === 0
            ? "Start solving to see your progress!"
            : `You've answered ${stats.totalAttempted} questions`}
        </Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Stats</Text>
        <View style={styles.statsRow}>
          <StatCard
            label="Correct"
            value={stats.totalCorrect}
            accent={Colors.light.correct}
          />
          <View style={{ width: 10 }} />
          <StatCard
            label="Attempted"
            value={stats.totalAttempted}
            accent={Colors.light.tint}
          />
          <View style={{ width: 10 }} />
          <StatCard
            label="Accuracy"
            value={`${accuracy}%`}
            accent="#D97706"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Streaks</Text>
        <View style={styles.streakCards}>
          <View style={styles.streakCard}>
            <Ionicons name="flame" size={32} color="#F59E0B" />
            <Text style={styles.streakValue}>{stats.streakCurrent}</Text>
            <Text style={styles.streakLabel}>Current Streak</Text>
          </View>
          <View style={styles.streakCard}>
            <Ionicons name="trophy" size={32} color={Colors.light.tint} />
            <Text style={styles.streakValue}>{stats.streakBest}</Text>
            <Text style={styles.streakLabel}>Best Streak</Text>
          </View>
          <View style={styles.streakCard}>
            <Ionicons name="star" size={32} color="#F59E0B" />
            <Text style={styles.streakValue}>{stats.stars}</Text>
            <Text style={styles.streakLabel}>Total Stars</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories Unlocked</Text>
        {Object.keys(categoryLabels).map((cat) => {
          const completed = stats.categoriesCompleted.includes(cat as any);
          return (
            <View key={cat} style={styles.categoryRow}>
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: completed ? categoryColors[cat] : Colors.light.border },
                ]}
              />
              <Text style={[styles.categoryLabel, !completed && styles.categoryDisabled]}>
                {categoryLabels[cat]}
              </Text>
              {completed && (
                <Ionicons name="checkmark-circle" size={18} color={Colors.light.correct} />
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Pressable
          onPress={handleReset}
          style={({ pressed }) => [styles.resetBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="refresh" size={16} color={Colors.light.incorrect} />
          <Text style={styles.resetText}>Reset My Progress</Text>
        </Pressable>
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  starRow: {
    marginBottom: 8,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
  },
  streakCards: {
    flexDirection: "row",
    gap: 10,
  },
  streakCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    fontFamily: "Inter_700Bold",
  },
  streakLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 10,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: Colors.light.text,
    fontFamily: "Inter_500Medium",
  },
  categoryDisabled: {
    color: Colors.light.textSecondary,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.light.incorrect,
  },
  resetText: {
    color: Colors.light.incorrect,
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
