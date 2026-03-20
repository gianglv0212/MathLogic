import { Category, Difficulty } from "@/contexts/GameContext";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category: Category;
  explanation: string;
  emoji: string;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uniqueId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeOptions(correct: number, min: number, max: number): string[] {
  const set = new Set<number>([correct]);
  while (set.size < 4) {
    set.add(rand(min, max));
  }
  return shuffle(Array.from(set).map(String));
}

export function generateAdditionQuestion(difficulty: Difficulty): Question {
  let a: number, b: number;
  if (difficulty === "easy") {
    a = rand(1, 10);
    b = rand(1, 10);
  } else if (difficulty === "medium") {
    a = rand(10, 50);
    b = rand(10, 50);
  } else {
    a = rand(50, 200);
    b = rand(50, 200);
  }
  const correct = a + b;
  const min = Math.max(0, correct - 20);
  const max = correct + 20;
  return {
    id: uniqueId(),
    question: `${a} + ${b} = ?`,
    options: makeOptions(correct, min, max),
    correctAnswer: String(correct),
    category: "addition",
    explanation: `${a} + ${b} = ${correct}. Great counting!`,
    emoji: "➕",
  };
}

export function generateSubtractionQuestion(difficulty: Difficulty): Question {
  let a: number, b: number;
  if (difficulty === "easy") {
    b = rand(1, 9);
    a = rand(b, 20);
  } else if (difficulty === "medium") {
    b = rand(5, 40);
    a = rand(b, 80);
  } else {
    b = rand(20, 150);
    a = rand(b, 300);
  }
  const correct = a - b;
  const min = Math.max(0, correct - 20);
  const max = correct + 20;
  return {
    id: uniqueId(),
    question: `${a} - ${b} = ?`,
    options: makeOptions(correct, min, max),
    correctAnswer: String(correct),
    category: "subtraction",
    explanation: `${a} - ${b} = ${correct}. You're a math star!`,
    emoji: "➖",
  };
}

export function generateMultiplicationQuestion(difficulty: Difficulty): Question {
  let a: number, b: number;
  if (difficulty === "easy") {
    a = rand(1, 5);
    b = rand(1, 5);
  } else if (difficulty === "medium") {
    a = rand(2, 9);
    b = rand(2, 9);
  } else {
    a = rand(6, 12);
    b = rand(6, 12);
  }
  const correct = a * b;
  const min = Math.max(0, correct - 20);
  const max = correct + 30;
  return {
    id: uniqueId(),
    question: `${a} × ${b} = ?`,
    options: makeOptions(correct, min, max),
    correctAnswer: String(correct),
    category: "multiplication",
    explanation: `${a} groups of ${b} = ${correct}. Brilliant!`,
    emoji: "✖️",
  };
}

export function generateLogicQuestion(difficulty: Difficulty): Question {
  const templates: Array<() => Question> = [
    () => {
      const total = difficulty === "easy" ? rand(5, 15) : difficulty === "medium" ? rand(10, 30) : rand(20, 60);
      const part = rand(1, total - 1);
      const correct = total - part;
      return {
        id: uniqueId(),
        question: `There are ${total} apples.\n${part} are red.\nHow many are green?`,
        options: makeOptions(correct, Math.max(0, correct - 10), correct + 10),
        correctAnswer: String(correct),
        category: "logic",
        explanation: `${total} - ${part} = ${correct} green apples!`,
        emoji: "🍎",
      };
    },
    () => {
      const legs = difficulty === "easy" ? rand(2, 4) : difficulty === "medium" ? rand(2, 8) : rand(4, 12);
      const animals = rand(2, 6);
      const correct = legs * animals;
      return {
        id: uniqueId(),
        question: `A spider has 8 legs.\nIf there are ${animals} spiders, how many legs in total?`,
        options: makeOptions(correct, Math.max(0, correct - 16), correct + 16),
        correctAnswer: String(correct),
        category: "logic",
        explanation: `${animals} × 8 = ${correct} legs!`,
        emoji: "🕷️",
      };
    },
    () => {
      const bags = rand(2, 6);
      const each = difficulty === "easy" ? rand(2, 5) : rand(3, 10);
      const correct = bags * each;
      return {
        id: uniqueId(),
        question: `There are ${bags} bags.\nEach bag has ${each} candies.\nHow many candies total?`,
        options: makeOptions(correct, Math.max(0, correct - 15), correct + 15),
        correctAnswer: String(correct),
        category: "logic",
        explanation: `${bags} × ${each} = ${correct} candies!`,
        emoji: "🍬",
      };
    },
  ];
  return templates[rand(0, templates.length - 1)]();
}

export function generatePatternQuestion(difficulty: Difficulty): Question {
  type PatternTemplate = {
    generate: () => { sequence: number[]; next: number };
  };

  const patterns: PatternTemplate[] = [
    {
      generate: () => {
        const start = rand(1, difficulty === "easy" ? 5 : 20);
        const step = rand(1, difficulty === "easy" ? 3 : difficulty === "medium" ? 7 : 15);
        const sequence = [start, start + step, start + 2 * step, start + 3 * step];
        return { sequence, next: start + 4 * step };
      },
    },
    {
      generate: () => {
        const start = rand(difficulty === "easy" ? 10 : 20, difficulty === "hard" ? 100 : 50);
        const step = rand(1, difficulty === "easy" ? 2 : 5);
        const sequence = [start, start - step, start - 2 * step, start - 3 * step];
        return { sequence, next: start - 4 * step };
      },
    },
    {
      generate: () => {
        const base = rand(2, difficulty === "easy" ? 3 : 5);
        const sequence = [base, base * 2, base * 4, base * 8];
        return { sequence, next: base * 16 };
      },
    },
  ];

  const chosen = patterns[rand(0, patterns.length - 1)].generate();
  const { sequence, next: correct } = chosen;

  return {
    id: uniqueId(),
    question: `What comes next?\n${sequence.join(" → ")} → ?`,
    options: makeOptions(correct, Math.max(0, correct - 20), correct + 20),
    correctAnswer: String(correct),
    category: "patterns",
    explanation: `The pattern continues: ${correct}!`,
    emoji: "🔢",
  };
}

export function generateQuestion(category: Category, difficulty: Difficulty): Question {
  switch (category) {
    case "addition": return generateAdditionQuestion(difficulty);
    case "subtraction": return generateSubtractionQuestion(difficulty);
    case "multiplication": return generateMultiplicationQuestion(difficulty);
    case "logic": return generateLogicQuestion(difficulty);
    case "patterns": return generatePatternQuestion(difficulty);
  }
}
