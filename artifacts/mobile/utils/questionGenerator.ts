import { Category } from "@/contexts/GameContext";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category: Category;
  explanation: string;
  emoji: string;
}

export interface AgeConfig {
  addMax: number;
  subMax: number;
  mulMax: number;
  availableCategories: Category[];
  label: string;
  description: string;
}

export const AGE_CONFIG: Record<number, AgeConfig> = {
  5: {
    addMax: 5,
    subMax: 5,
    mulMax: 2,
    availableCategories: ["addition"],
    label: "Age 5",
    description: "Simple counting & adding up to 5",
  },
  6: {
    addMax: 10,
    subMax: 10,
    mulMax: 3,
    availableCategories: ["addition", "subtraction"],
    label: "Age 6",
    description: "Adding & taking away up to 10",
  },
  7: {
    addMax: 20,
    subMax: 15,
    mulMax: 5,
    availableCategories: ["addition", "subtraction"],
    label: "Age 7",
    description: "Numbers up to 20, +  and  −",
  },
  8: {
    addMax: 50,
    subMax: 30,
    mulMax: 5,
    availableCategories: ["addition", "subtraction", "logic"],
    label: "Age 8",
    description: "Numbers up to 50, word problems",
  },
  9: {
    addMax: 100,
    subMax: 80,
    mulMax: 7,
    availableCategories: ["addition", "subtraction", "multiplication", "logic"],
    label: "Age 9",
    description: "Up to 100, ×  tables up to 7",
  },
  10: {
    addMax: 150,
    subMax: 120,
    mulMax: 10,
    availableCategories: ["addition", "subtraction", "multiplication", "logic"],
    label: "Age 10",
    description: "Up to 150, ×  tables up to 10",
  },
  11: {
    addMax: 200,
    subMax: 180,
    mulMax: 12,
    availableCategories: ["addition", "subtraction", "multiplication", "logic", "patterns"],
    label: "Age 11",
    description: "All operations, patterns & sequences",
  },
  12: {
    addMax: 500,
    subMax: 400,
    mulMax: 12,
    availableCategories: ["addition", "subtraction", "multiplication", "logic", "patterns"],
    label: "Age 12",
    description: "Larger numbers, all topics",
  },
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uniqueId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeOptions(correct: number, spread: number): string[] {
  const set = new Set<number>([correct]);
  let attempts = 0;
  while (set.size < 4 && attempts < 50) {
    const offset = rand(1, Math.max(spread, 4));
    const sign = Math.random() > 0.5 ? 1 : -1;
    const candidate = correct + sign * offset;
    if (candidate >= 0 && candidate !== correct) set.add(candidate);
    attempts++;
  }
  // fallback if not enough unique options
  let fill = 1;
  while (set.size < 4) {
    if (!set.has(correct + fill)) set.add(correct + fill);
    fill++;
  }
  return shuffle(Array.from(set).map(String));
}

export function generateAdditionQuestion(age: number): Question {
  const cfg = AGE_CONFIG[age];
  const a = rand(1, cfg.addMax);
  const b = rand(1, cfg.addMax);
  const correct = a + b;
  return {
    id: uniqueId(),
    question: `${a} + ${b} = ?`,
    options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
    correctAnswer: String(correct),
    category: "addition",
    explanation: `${a} + ${b} = ${correct}. Great counting!`,
    emoji: "➕",
  };
}

export function generateSubtractionQuestion(age: number): Question {
  const cfg = AGE_CONFIG[age];
  const b = rand(1, cfg.subMax);
  const a = rand(b, cfg.subMax + b);
  const correct = a - b;
  return {
    id: uniqueId(),
    question: `${a} − ${b} = ?`,
    options: makeOptions(correct, Math.max(4, Math.round(a * 0.3))),
    correctAnswer: String(correct),
    category: "subtraction",
    explanation: `${a} − ${b} = ${correct}. You're a math star!`,
    emoji: "➖",
  };
}

export function generateMultiplicationQuestion(age: number): Question {
  const cfg = AGE_CONFIG[age];
  const a = rand(1, cfg.mulMax);
  const b = rand(1, cfg.mulMax);
  const correct = a * b;
  return {
    id: uniqueId(),
    question: `${a} × ${b} = ?`,
    options: makeOptions(correct, Math.max(4, correct)),
    correctAnswer: String(correct),
    category: "multiplication",
    explanation: `${a} groups of ${b} = ${correct}. Brilliant!`,
    emoji: "✖️",
  };
}

export function generateLogicQuestion(age: number): Question {
  const cfg = AGE_CONFIG[age];
  const max = Math.min(cfg.addMax, 30);

  const templates: Array<() => Question> = [
    () => {
      const total = rand(Math.ceil(max / 3), max);
      const part = rand(1, total - 1);
      const correct = total - part;
      return {
        id: uniqueId(),
        question: `There are ${total} apples.\n${part} are red.\nHow many are green?`,
        options: makeOptions(correct, Math.max(4, Math.round(total * 0.4))),
        correctAnswer: String(correct),
        category: "logic",
        explanation: `${total} − ${part} = ${correct} green apples!`,
        emoji: "🍎",
      };
    },
    () => {
      const bags = rand(2, Math.min(6, Math.ceil(max / 5)));
      const each = rand(2, Math.min(8, Math.ceil(max / bags)));
      const correct = bags * each;
      return {
        id: uniqueId(),
        question: `There are ${bags} bags.\nEach bag has ${each} candies.\nHow many candies in total?`,
        options: makeOptions(correct, Math.max(4, correct)),
        correctAnswer: String(correct),
        category: "logic",
        explanation: `${bags} × ${each} = ${correct} candies!`,
        emoji: "🍬",
      };
    },
    () => {
      const animals = rand(2, Math.min(5, Math.ceil(max / 8)));
      const correct = animals * 8;
      return {
        id: uniqueId(),
        question: `A spider has 8 legs.\nIf there are ${animals} spiders,\nhow many legs in total?`,
        options: makeOptions(correct, Math.max(4, correct)),
        correctAnswer: String(correct),
        category: "logic",
        explanation: `${animals} × 8 = ${correct} legs!`,
        emoji: "🕷️",
      };
    },
    () => {
      const kids = rand(2, Math.min(8, Math.ceil(max / 3)));
      const each = rand(1, Math.min(5, Math.ceil(max / kids)));
      const correct = kids * each;
      return {
        id: uniqueId(),
        question: `${kids} kids each have ${each} pencils.\nHow many pencils altogether?`,
        options: makeOptions(correct, Math.max(4, correct)),
        correctAnswer: String(correct),
        category: "logic",
        explanation: `${kids} × ${each} = ${correct} pencils!`,
        emoji: "✏️",
      };
    },
  ];

  return templates[rand(0, templates.length - 1)]();
}

export function generatePatternQuestion(age: number): Question {
  const cfg = AGE_CONFIG[age];
  const maxStep = Math.max(2, Math.min(15, Math.round(cfg.addMax / 10)));

  const patterns: Array<() => { sequence: number[]; next: number }> = [
    () => {
      const start = rand(1, Math.min(20, cfg.addMax / 4));
      const step = rand(1, maxStep);
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      return { sequence: seq, next: start + 4 * step };
    },
    () => {
      const start = rand(Math.min(20, cfg.addMax / 2), Math.min(50, cfg.addMax));
      const step = rand(1, maxStep);
      const seq = [start, start - step, start - 2 * step, start - 3 * step];
      return { sequence: seq, next: Math.max(0, start - 4 * step) };
    },
    () => {
      const base = rand(2, Math.min(4, maxStep));
      const seq = [base, base * 2, base * 4, base * 8];
      return { sequence: seq, next: base * 16 };
    },
    () => {
      const start = rand(1, Math.min(10, cfg.addMax / 10));
      const step = rand(2, maxStep + 1);
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      return { sequence: seq, next: start + 4 * step };
    },
  ];

  const { sequence, next: correct } = patterns[rand(0, patterns.length - 1)]();

  return {
    id: uniqueId(),
    question: `What comes next?\n${sequence.join(" → ")} → ?`,
    options: makeOptions(correct, Math.max(4, Math.round(correct * 0.4))),
    correctAnswer: String(correct),
    category: "patterns",
    explanation: `The pattern continues: ${correct}!`,
    emoji: "🔢",
  };
}

export function generateQuestion(category: Category, age: number): Question {
  switch (category) {
    case "addition":      return generateAdditionQuestion(age);
    case "subtraction":   return generateSubtractionQuestion(age);
    case "multiplication": return generateMultiplicationQuestion(age);
    case "logic":         return generateLogicQuestion(age);
    case "patterns":      return generatePatternQuestion(age);
  }
}
