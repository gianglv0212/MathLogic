import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Category = "addition" | "subtraction" | "multiplication" | "logic" | "patterns";

export interface GameStats {
  totalCorrect: number;
  totalAttempted: number;
  streakCurrent: number;
  streakBest: number;
  stars: number;
  levelScores: Record<string, number>;
  categoriesCompleted: Category[];
}

interface GameContextType {
  stats: GameStats;
  age: number | null;
  setAge: (age: number) => Promise<void>;
  recordAnswer: (correct: boolean, category: Category) => void;
  resetStats: () => void;
  isLoading: boolean;
}

const defaultStats: GameStats = {
  totalCorrect: 0,
  totalAttempted: 0,
  streakCurrent: 0,
  streakBest: 0,
  stars: 0,
  levelScores: {},
  categoriesCompleted: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = "@mathkids:stats";
const AGE_KEY = "@mathkids:age";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const [age, setAgeState] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [savedStats, savedAge] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(AGE_KEY),
        ]);
        if (savedStats) setStats(JSON.parse(savedStats));
        if (savedAge) setAgeState(Number(savedAge));
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const saveStats = useCallback(async (newStats: GameStats) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    } catch {}
  }, []);

  const setAge = useCallback(async (newAge: number) => {
    setAgeState(newAge);
    try {
      await AsyncStorage.setItem(AGE_KEY, String(newAge));
    } catch {}
  }, []);

  const recordAnswer = useCallback(
    (correct: boolean, category: Category) => {
      setStats((prev) => {
        const newStreak = correct ? prev.streakCurrent + 1 : 0;
        const newStats: GameStats = {
          ...prev,
          totalAttempted: prev.totalAttempted + 1,
          totalCorrect: correct ? prev.totalCorrect + 1 : prev.totalCorrect,
          streakCurrent: newStreak,
          streakBest: Math.max(prev.streakBest, newStreak),
          stars: correct ? prev.stars + 1 : prev.stars,
          categoriesCompleted:
            correct && !prev.categoriesCompleted.includes(category)
              ? [...prev.categoriesCompleted, category]
              : prev.categoriesCompleted,
        };
        saveStats(newStats);
        return newStats;
      });
    },
    [saveStats]
  );

  const resetStats = useCallback(async () => {
    setStats(defaultStats);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <GameContext.Provider
      value={{ stats, age, setAge, recordAnswer, resetStats, isLoading }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
