import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AnswerOption } from "@/components/AnswerOption";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultModal } from "@/components/ResultModal";
import Colors from "@/constants/colors";
import { Category, useGame } from "@/contexts/GameContext";
import { Question, generateQuestion } from "@/utils/questionGenerator";

const TOTAL_QUESTIONS = 10;

type OptionState = "default" | "selected" | "correct" | "incorrect";

export default function QuizScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const insets = useSafeAreaInsets();
  const { difficulty, stats, recordAnswer } = useGame();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? Math.max(insets.top + 67, 20) : insets.top + 12;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>({});
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const generateQuestions = useCallback(() => {
    const qs: Question[] = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      qs.push(generateQuestion(category as Category, difficulty));
    }
    setQuestions(qs);
    setCurrentIndex(0);
    setSelectedOption(null);
    setOptionStates({});
    setAnswered(false);
    setShowResult(false);
    setSessionCorrect(0);
    setFinished(false);
  }, [category, difficulty]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  const animateIn = useCallback(() => {
    slideAnim.setValue(40);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 80,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  useEffect(() => {
    animateIn();
  }, [currentIndex, animateIn]);

  const question = questions[currentIndex];

  const handleOptionPress = (option: string) => {
    if (answered) return;

    setSelectedOption(option);
    setAnswered(true);

    const isCorrect = option === question.correctAnswer;

    const newStates: Record<string, OptionState> = {};
    question.options.forEach((o) => {
      if (o === question.correctAnswer) {
        newStates[o] = "correct";
      } else if (o === option && !isCorrect) {
        newStates[o] = "incorrect";
      } else {
        newStates[o] = "default";
      }
    });
    setOptionStates(newStates);

    if (isCorrect) {
      setSessionCorrect((prev) => prev + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    recordAnswer(isCorrect, category as Category);
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    if (currentIndex + 1 >= TOTAL_QUESTIONS) {
      setFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setOptionStates({});
    setAnswered(false);
  };

  if (!question && !finished) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (finished) {
    const pct = Math.round((sessionCorrect / TOTAL_QUESTIONS) * 100);
    const starsEarned = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;
    return (
      <View style={[styles.finishScreen, { paddingTop: topPad }]}>
        <View style={styles.finishCard}>
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy" size={56} color="#F59E0B" />
          </View>
          <Text style={styles.finishTitle}>Quiz Complete!</Text>
          <Text style={styles.finishScore}>
            {sessionCorrect} / {TOTAL_QUESTIONS} correct
          </Text>
          <Text style={styles.finishPercent}>{pct}% accuracy</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < starsEarned ? "star" : "star-outline"}
                size={32}
                color={i < starsEarned ? "#F59E0B" : Colors.light.border}
                style={{ marginHorizontal: 4 }}
              />
            ))}
          </View>
          <Text style={styles.finishMsg}>
            {pct >= 80
              ? "Outstanding! You're a math champion!"
              : pct >= 50
              ? "Great work! Keep practicing!"
              : "Good try! You'll do better next time!"}
          </Text>
          <Pressable
            onPress={generateQuestions}
            style={({ pressed }) => [styles.playAgainBtn, { opacity: pressed ? 0.9 : 1 }]}
          >
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.playAgainText}>Play Again</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.homeBtn, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: topPad }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.light.text} />
        </Pressable>
        <View style={styles.progressContainer}>
          <ProgressBar progress={(currentIndex) / TOTAL_QUESTIONS} />
        </View>
        <View style={styles.counterChip}>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{TOTAL_QUESTIONS}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <View style={styles.questionCard}>
            <Text style={styles.questionEmoji}>{question.emoji}</Text>
            <Text style={styles.questionText}>{question.question}</Text>
          </View>

          <Text style={styles.pickLabel}>Pick the right answer</Text>

          {question.options.map((option) => (
            <AnswerOption
              key={option}
              label={option}
              state={optionStates[option] ?? (selectedOption === option ? "selected" : "default")}
              onPress={() => handleOptionPress(option)}
              disabled={answered}
            />
          ))}
        </Animated.View>
      </ScrollView>

      <ResultModal
        visible={showResult}
        correct={selectedOption === question.correctAnswer}
        explanation={question.explanation}
        streakCount={stats.streakCurrent}
        onNext={handleNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  progressContainer: {
    flex: 1,
  },
  counterChip: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  counterText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  questionCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 140,
    justifyContent: "center",
  },
  questionEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.text,
    textAlign: "center",
    fontFamily: "Inter_700Bold",
    lineHeight: 32,
  },
  pickLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontFamily: "Inter_400Regular",
    marginBottom: 12,
    textAlign: "center",
  },
  finishScreen: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  finishCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  trophyCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  finishTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.light.text,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  finishScore: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.tint,
    fontFamily: "Inter_600SemiBold",
  },
  finishPercent: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontFamily: "Inter_400Regular",
    marginBottom: 12,
    marginTop: 4,
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  finishMsg: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 24,
  },
  playAgainBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: "100%",
    justifyContent: "center",
    marginBottom: 10,
  },
  playAgainText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  homeBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  homeBtnText: {
    color: Colors.light.textSecondary,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});
