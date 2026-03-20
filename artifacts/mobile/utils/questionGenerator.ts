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
    description: "Numbers up to 20, + and −",
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
    description: "Up to 100, × tables up to 7",
  },
  10: {
    addMax: 150,
    subMax: 120,
    mulMax: 10,
    availableCategories: ["addition", "subtraction", "multiplication", "logic"],
    label: "Age 10",
    description: "Up to 150, × tables up to 10",
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

// ─── helpers ────────────────────────────────────────────────────────────────

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uniqueId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(correct: number, spread: number): string[] {
  const set = new Set<number>([correct]);
  let attempts = 0;
  while (set.size < 4 && attempts < 60) {
    const offset = rand(1, Math.max(spread, 4));
    const sign = Math.random() > 0.5 ? 1 : -1;
    const candidate = correct + sign * offset;
    if (candidate >= 0 && candidate !== correct) set.add(candidate);
    attempts++;
  }
  let fill = 1;
  while (set.size < 4) {
    if (!set.has(correct + fill)) set.add(correct + fill);
    fill++;
  }
  return shuffle(Array.from(set).map(String));
}

function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

// ─── ADDITION ────────────────────────────────────────────────────────────────

export function generateAdditionQuestion(age: number): Question {
  const cfg = AGE_CONFIG[age];
  const max = cfg.addMax;

  type Template = () => Question;

  // Basic templates available at all ages
  const basic: Template[] = [
    // 1. Simple a + b = ?
    () => {
      const a = rand(1, max);
      const b = rand(1, max);
      const correct = a + b;
      return {
        id: uniqueId(), question: `${a} + ${b} = ?`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "addition",
        explanation: `${a} + ${b} = ${correct}. Great counting!`, emoji: "➕",
      };
    },
    // 2. Missing addend: a + ? = c
    () => {
      const a = rand(1, Math.max(1, max - 1));
      const b = rand(1, Math.max(1, max - a));
      const correct = b;
      return {
        id: uniqueId(), question: `${a} + ? = ${a + b}`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.4))),
        correctAnswer: String(correct), category: "addition",
        explanation: `${a} + ${correct} = ${a + b}. You found the missing number!`, emoji: "❓",
      };
    },
    // 3. Word problem: fruit
    () => {
      const items = pick(["apples 🍎", "bananas 🍌", "oranges 🍊", "strawberries 🍓", "grapes 🍇"]);
      const a = rand(1, Math.max(1, Math.floor(max / 2)));
      const b = rand(1, Math.max(1, Math.floor(max / 2)));
      const correct = a + b;
      return {
        id: uniqueId(),
        question: `You have ${a} ${items}.\nYou get ${b} more.\nHow many now?`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "addition",
        explanation: `${a} + ${b} = ${correct} ${items}!`, emoji: "🛒",
      };
    },
    // 4. Doubles
    () => {
      const a = rand(1, Math.min(max, 20));
      const correct = a * 2;
      return {
        id: uniqueId(), question: `What is double ${a}?`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "addition",
        explanation: `Double ${a} = ${a} + ${a} = ${correct}!`, emoji: "✌️",
      };
    },
    // 5. Word problem: toys/stickers
    () => {
      const items = pick(["stickers", "marbles", "toy cars", "crayons", "books"]);
      const a = rand(1, Math.max(1, Math.floor(max / 2)));
      const b = rand(1, Math.max(1, Math.floor(max / 2)));
      const correct = a + b;
      return {
        id: uniqueId(),
        question: `Sam has ${a} ${items}.\nAlex gives Sam ${b} more.\nHow many ${items} does Sam have?`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "addition",
        explanation: `${a} + ${b} = ${correct} ${items}!`, emoji: "🎁",
      };
    },
  ];

  // Templates for ages 7+
  const medium: Template[] = [
    // 6. Three numbers added
    () => {
      const m = Math.floor(max / 3);
      const a = rand(1, m);
      const b = rand(1, m);
      const c = rand(1, m);
      const correct = a + b + c;
      return {
        id: uniqueId(), question: `${a} + ${b} + ${c} = ?`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "addition",
        explanation: `${a} + ${b} + ${c} = ${correct}. Three in a row!`, emoji: "🔢",
      };
    },
    // 7. ? + b = c (missing first addend)
    () => {
      const b = rand(1, Math.floor(max / 2));
      const c = rand(b + 1, max + b);
      const correct = c - b;
      return {
        id: uniqueId(), question: `? + ${b} = ${c}`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "addition",
        explanation: `${correct} + ${b} = ${c}. Work backwards!`, emoji: "🔍",
      };
    },
    // 8. Sum of two word problem (scores)
    () => {
      const playerA = pick(["Alice", "Ben", "Cara", "Dave", "Emma"]);
      const playerB = pick(["Finn", "Grace", "Henry", "Isla", "Jake"]);
      const a = rand(1, Math.floor(max / 2));
      const b = rand(1, Math.floor(max / 2));
      const correct = a + b;
      return {
        id: uniqueId(),
        question: `${playerA} scored ${a} points.\n${playerB} scored ${b} points.\nTotal score?`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "addition",
        explanation: `${a} + ${b} = ${correct} points total!`, emoji: "🏅",
      };
    },
    // 9. Nearest ten (round up)
    () => {
      const tens = rand(1, Math.floor(max / 10)) * 10;
      const extra = rand(1, 9);
      const correct = tens + extra;
      return {
        id: uniqueId(), question: `${tens} + ${extra} = ?`,
        options: makeOptions(correct, Math.max(4, 5)),
        correctAnswer: String(correct), category: "addition",
        explanation: `${tens} + ${extra} = ${correct}. Adding to tens!`, emoji: "🔟",
      };
    },
  ];

  // Templates for ages 9+
  const advanced: Template[] = [
    // 10. Sum of consecutive numbers
    () => {
      const start = rand(1, Math.floor(max / 4));
      const correct = start + (start + 1) + (start + 2);
      return {
        id: uniqueId(),
        question: `What is the sum of\n${start}, ${start + 1}, and ${start + 2}?`,
        options: makeOptions(correct, Math.max(5, Math.round(correct * 0.2))),
        correctAnswer: String(correct), category: "addition",
        explanation: `${start} + ${start + 1} + ${start + 2} = ${correct}!`, emoji: "📊",
      };
    },
    // 11. Larger word problem
    () => {
      const a = rand(Math.floor(max / 4), Math.floor(max * 3 / 4));
      const b = rand(Math.floor(max / 4), Math.floor(max * 3 / 4));
      const correct = a + b;
      return {
        id: uniqueId(),
        question: `A school has ${a} boys\nand ${b} girls.\nHow many students in total?`,
        options: makeOptions(correct, Math.max(5, Math.round(correct * 0.15))),
        correctAnswer: String(correct), category: "addition",
        explanation: `${a} + ${b} = ${correct} students!`, emoji: "🏫",
      };
    },
    // 12. Money word problem
    () => {
      const unit = age >= 10 ? "p" : "p";
      const a = rand(10, Math.min(max, 95));
      const b = rand(1, Math.min(100 - a, max));
      const correct = a + b;
      return {
        id: uniqueId(),
        question: `You have ${a}${unit}.\nYou earn ${b}${unit} more.\nHow much do you have?`,
        options: makeOptions(correct, Math.max(5, Math.round(correct * 0.15))),
        correctAnswer: String(correct), category: "addition",
        explanation: `${a} + ${b} = ${correct}${unit} total!`, emoji: "💰",
      };
    },
  ];

  let pool: Template[] = [...basic];
  if (age >= 7) pool = [...pool, ...medium];
  if (age >= 9) pool = [...pool, ...advanced];

  return pick(pool)();
}

// ─── SUBTRACTION ─────────────────────────────────────────────────────────────

export function generateSubtractionQuestion(age: number): Question {
  const cfg = AGE_CONFIG[age];
  const max = cfg.subMax;

  type Template = () => Question;

  const basic: Template[] = [
    // 1. Simple a - b
    () => {
      const b = rand(1, max);
      const a = rand(b, max + b);
      const correct = a - b;
      return {
        id: uniqueId(), question: `${a} − ${b} = ?`,
        options: makeOptions(correct, Math.max(4, Math.round(a * 0.3))),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${a} − ${b} = ${correct}. You're a math star!`, emoji: "➖",
      };
    },
    // 2. Word: eating/losing items
    () => {
      const items = pick(["cookies 🍪", "balloons 🎈", "fish 🐟", "flowers 🌸", "stars ⭐"]);
      const total = rand(3, max);
      const gone = rand(1, total - 1);
      const correct = total - gone;
      return {
        id: uniqueId(),
        question: `You had ${total} ${items}.\nYou gave away ${gone}.\nHow many are left?`,
        options: makeOptions(correct, Math.max(4, Math.round(total * 0.3))),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${total} − ${gone} = ${correct} left!`, emoji: "🎁",
      };
    },
    // 3. How many more?
    () => {
      const a = rand(3, max);
      const b = rand(1, a - 1);
      const correct = a - b;
      return {
        id: uniqueId(),
        question: `${a} is how many more\nthan ${b}?`,
        options: makeOptions(correct, Math.max(4, Math.round(a * 0.3))),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${a} − ${b} = ${correct}. That's the difference!`, emoji: "📏",
      };
    },
    // 4. Missing subtrahend: a - ? = c
    () => {
      const a = rand(4, max);
      const c = rand(1, a - 1);
      const correct = a - c;
      return {
        id: uniqueId(), question: `${a} − ? = ${c}`,
        options: makeOptions(correct, Math.max(4, Math.round(a * 0.3))),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${a} − ${correct} = ${c}. You found the missing number!`, emoji: "❓",
      };
    },
    // 5. Word: birds on a fence
    () => {
      const start = rand(4, Math.min(max, 15));
      const flew = rand(1, start - 1);
      const correct = start - flew;
      return {
        id: uniqueId(),
        question: `${start} birds sat on a fence.\n${flew} flew away.\nHow many birds are left?`,
        options: makeOptions(correct, Math.max(4, Math.round(start * 0.3))),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${start} − ${flew} = ${correct} birds!`, emoji: "🐦",
      };
    },
  ];

  const medium: Template[] = [
    // 6. ? - b = c (missing minuend)
    () => {
      const b = rand(2, Math.floor(max / 2));
      const c = rand(1, Math.floor(max / 2));
      const correct = b + c;
      return {
        id: uniqueId(), question: `? − ${b} = ${c}`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${correct} − ${b} = ${c}. Work it out backwards!`, emoji: "🔍",
      };
    },
    // 7. Score difference
    () => {
      const teamA = rand(10, max);
      const teamB = rand(1, teamA - 1);
      const correct = teamA - teamB;
      return {
        id: uniqueId(),
        question: `Team A scored ${teamA}.\nTeam B scored ${teamB}.\nBy how many did A win?`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${teamA} − ${teamB} = ${correct}. A won by ${correct}!`, emoji: "🏆",
      };
    },
    // 8. Subtract from round number
    () => {
      const tens = rand(1, Math.floor(max / 10)) * 10;
      const sub = rand(1, Math.min(9, tens));
      const correct = tens - sub;
      return {
        id: uniqueId(), question: `${tens} − ${sub} = ?`,
        options: makeOptions(correct, Math.max(4, 5)),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${tens} − ${sub} = ${correct}. Subtracting from tens!`, emoji: "🔟",
      };
    },
    // 9. Library books
    () => {
      const total = rand(10, max);
      const borrowed = rand(2, Math.floor(total * 0.7));
      const correct = total - borrowed;
      return {
        id: uniqueId(),
        question: `A library has ${total} books.\n${borrowed} are borrowed.\nHow many remain on the shelf?`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${total} − ${borrowed} = ${correct} books on shelf!`, emoji: "📚",
      };
    },
  ];

  const advanced: Template[] = [
    // 10. Money change
    () => {
      const price = rand(10, Math.min(max, 90));
      const paid = (Math.ceil(price / 10) + rand(0, 2)) * 10;
      const correct = paid - price;
      return {
        id: uniqueId(),
        question: `An item costs ${price}p.\nYou pay ${paid}p.\nWhat is your change?`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.5))),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${paid} − ${price} = ${correct}p change!`, emoji: "💰",
      };
    },
    // 11. Larger subtraction
    () => {
      const a = rand(Math.floor(max / 2), max);
      const b = rand(Math.floor(a / 4), Math.floor(a * 3 / 4));
      const correct = a - b;
      return {
        id: uniqueId(),
        question: `${a} − ${b} = ?`,
        options: makeOptions(correct, Math.max(5, Math.round(a * 0.15))),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${a} − ${b} = ${correct}!`, emoji: "➖",
      };
    },
    // 12. Seats in hall
    () => {
      const total = rand(50, Math.min(max, 200));
      const taken = rand(10, total - 5);
      const correct = total - taken;
      return {
        id: uniqueId(),
        question: `A hall has ${total} seats.\n${taken} are taken.\nHow many seats are free?`,
        options: makeOptions(correct, Math.max(5, Math.round(correct * 0.2))),
        correctAnswer: String(correct), category: "subtraction",
        explanation: `${total} − ${taken} = ${correct} free seats!`, emoji: "🎭",
      };
    },
  ];

  let pool: Template[] = [...basic];
  if (age >= 7) pool = [...pool, ...medium];
  if (age >= 9) pool = [...pool, ...advanced];

  return pick(pool)();
}

// ─── MULTIPLICATION ──────────────────────────────────────────────────────────

export function generateMultiplicationQuestion(age: number): Question {
  const cfg = AGE_CONFIG[age];
  const max = cfg.mulMax;

  type Template = () => Question;

  const basic: Template[] = [
    // 1. Simple a × b
    () => {
      const a = rand(1, max);
      const b = rand(1, max);
      const correct = a * b;
      return {
        id: uniqueId(), question: `${a} × ${b} = ?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${a} × ${b} = ${correct}. Brilliant!`, emoji: "✖️",
      };
    },
    // 2. Rows and columns
    () => {
      const rows = rand(2, max);
      const cols = rand(2, max);
      const correct = rows * cols;
      return {
        id: uniqueId(),
        question: `A grid has ${rows} rows\nand ${cols} columns.\nHow many squares total?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${rows} × ${cols} = ${correct} squares!`, emoji: "🔲",
      };
    },
    // 3. Repeated addition as multiplication
    () => {
      const times = rand(2, Math.min(max, 6));
      const each = rand(2, Math.min(max, 8));
      const correct = times * each;
      return {
        id: uniqueId(),
        question: `${each} + ${each} + ${each}${times > 3 ? ` ... (${times} times)` : times === 3 ? ` + ${each}` : ""} = ?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${each} added ${times} times = ${times} × ${each} = ${correct}!`, emoji: "🔁",
      };
    },
    // 4. Packs of items
    () => {
      const packs = rand(2, Math.min(max, 6));
      const each = rand(2, Math.min(max, 8));
      const item = pick(["biscuits", "crayons", "sweets", "pencils", "marbles"]);
      const correct = packs * each;
      return {
        id: uniqueId(),
        question: `There are ${packs} packs.\nEach pack has ${each} ${item}.\nHow many ${item} in total?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${packs} × ${each} = ${correct} ${item}!`, emoji: "📦",
      };
    },
    // 5. Missing factor: a × ? = c
    () => {
      const a = rand(2, max);
      const b = rand(2, max);
      const correct = b;
      return {
        id: uniqueId(), question: `${a} × ? = ${a * b}`,
        options: makeOptions(correct, Math.max(4, 4)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${a} × ${correct} = ${a * b}. You found it!`, emoji: "❓",
      };
    },
    // 6. Tables question
    () => {
      const table = rand(2, max);
      const times = rand(1, 12);
      const correct = table * times;
      return {
        id: uniqueId(), question: `What is ${times} in the ${table} times table?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${table} × ${times} = ${correct}. Know your tables!`, emoji: "📋",
      };
    },
  ];

  const medium: Template[] = [
    // 7. Legs on animals
    () => {
      const { name, legs, emoji: em } = pick([
        { name: "cat", legs: 4, emoji: "🐱" },
        { name: "dog", legs: 4, emoji: "🐶" },
        { name: "bird", legs: 2, emoji: "🐦" },
        { name: "spider", legs: 8, emoji: "🕷️" },
        { name: "ant", legs: 6, emoji: "🐜" },
      ]);
      const count = rand(2, Math.min(max, Math.floor(24 / legs)));
      const correct = count * legs;
      return {
        id: uniqueId(),
        question: `A ${name} has ${legs} legs.\nHow many legs do ${count} ${name}s have?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${count} × ${legs} = ${correct} legs!`, emoji: em,
      };
    },
    // 8. Money × quantity
    () => {
      const price = rand(2, Math.min(max, 10));
      const qty = rand(2, Math.min(max, 8));
      const correct = price * qty;
      return {
        id: uniqueId(),
        question: `Each ticket costs £${price}.\nYou buy ${qty} tickets.\nHow much do you pay?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${qty} × £${price} = £${correct}!`, emoji: "🎟️",
      };
    },
    // 9. Flowers in vases
    () => {
      const vases = rand(2, Math.min(max, 8));
      const each = rand(2, Math.min(max, 8));
      const correct = vases * each;
      return {
        id: uniqueId(),
        question: `There are ${vases} vases.\nEach vase has ${each} flowers.\nHow many flowers altogether?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${vases} × ${each} = ${correct} flowers!`, emoji: "🌸",
      };
    },
    // 10. Wheels on vehicles
    () => {
      const { name, wheels, emoji: em } = pick([
        { name: "car", wheels: 4, emoji: "🚗" },
        { name: "bike", wheels: 2, emoji: "🚲" },
        { name: "truck", wheels: 6, emoji: "🚛" },
        { name: "tricycle", wheels: 3, emoji: "🛺" },
      ]);
      const count = rand(2, Math.min(max, Math.floor(30 / wheels)));
      const correct = count * wheels;
      return {
        id: uniqueId(),
        question: `A ${name} has ${wheels} wheels.\nHow many wheels do ${count} ${name}s have?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${count} × ${wheels} = ${correct} wheels!`, emoji: em,
      };
    },
  ];

  const advanced: Template[] = [
    // 11. Area of rectangle
    () => {
      const w = rand(3, max);
      const h = rand(3, max);
      const correct = w * h;
      return {
        id: uniqueId(),
        question: `A rectangle is ${w} cm wide\nand ${h} cm tall.\nWhat is its area?`,
        options: makeOptions(correct, Math.max(8, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `Area = ${w} × ${h} = ${correct} cm²!`, emoji: "📐",
      };
    },
    // 12. Days/weeks conversion
    () => {
      const weeks = rand(2, Math.min(max, 8));
      const correct = weeks * 7;
      return {
        id: uniqueId(),
        question: `How many days are\nin ${weeks} weeks?`,
        options: makeOptions(correct, Math.max(5, 7)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${weeks} weeks × 7 days = ${correct} days!`, emoji: "📅",
      };
    },
    // 13. Hours conversion
    () => {
      const hrs = rand(2, Math.min(max, 8));
      const correct = hrs * 60;
      return {
        id: uniqueId(),
        question: `How many minutes\nare in ${hrs} hours?`,
        options: makeOptions(correct, Math.max(8, 20)),
        correctAnswer: String(correct), category: "multiplication",
        explanation: `${hrs} hours × 60 minutes = ${correct} minutes!`, emoji: "⏰",
      };
    },
  ];

  let pool: Template[] = [...basic];
  if (age >= 9) pool = [...pool, ...medium];
  if (age >= 11) pool = [...pool, ...advanced];

  return pick(pool)();
}

// ─── LOGIC ───────────────────────────────────────────────────────────────────

export function generateLogicQuestion(age: number): Question {
  const cfg = AGE_CONFIG[age];
  const max = Math.min(cfg.addMax, age >= 10 ? 100 : 50);

  type Template = () => Question;

  const basic: Template[] = [
    // 1. Apples red/green
    () => {
      const total = rand(4, Math.min(max, 20));
      const part = rand(1, total - 1);
      const correct = total - part;
      return {
        id: uniqueId(),
        question: `There are ${total} apples.\n${part} are red.\nHow many are green?`,
        options: makeOptions(correct, Math.max(4, Math.round(total * 0.4))),
        correctAnswer: String(correct), category: "logic",
        explanation: `${total} − ${part} = ${correct} green apples!`, emoji: "🍎",
      };
    },
    // 2. Bags of candies
    () => {
      const bags = rand(2, Math.min(6, Math.ceil(max / 5)));
      const each = rand(2, Math.min(8, Math.ceil(max / bags)));
      const correct = bags * each;
      return {
        id: uniqueId(),
        question: `There are ${bags} bags.\nEach bag has ${each} candies.\nHow many candies in total?`,
        options: makeOptions(correct, Math.max(4, correct)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${bags} × ${each} = ${correct} candies!`, emoji: "🍬",
      };
    },
    // 3. Spiders legs
    () => {
      const animals = rand(2, Math.min(5, Math.ceil(max / 8)));
      const correct = animals * 8;
      return {
        id: uniqueId(),
        question: `A spider has 8 legs.\nIf there are ${animals} spiders,\nhow many legs in total?`,
        options: makeOptions(correct, Math.max(4, correct)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${animals} × 8 = ${correct} legs!`, emoji: "🕷️",
      };
    },
    // 4. Kids with pencils
    () => {
      const kids = rand(2, Math.min(8, Math.ceil(max / 3)));
      const each = rand(1, Math.min(5, Math.ceil(max / kids)));
      const correct = kids * each;
      return {
        id: uniqueId(),
        question: `${kids} kids each have ${each} pencils.\nHow many pencils altogether?`,
        options: makeOptions(correct, Math.max(4, correct)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${kids} × ${each} = ${correct} pencils!`, emoji: "✏️",
      };
    },
    // 5. Sharing equally
    () => {
      const kids = rand(2, 5);
      const each = rand(2, Math.min(8, Math.floor(max / kids)));
      const total = kids * each;
      const correct = each;
      return {
        id: uniqueId(),
        question: `${total} sweets are shared\nequally among ${kids} kids.\nHow many each?`,
        options: makeOptions(correct, Math.max(4, correct)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${total} ÷ ${kids} = ${correct} sweets each!`, emoji: "🍭",
      };
    },
    // 6. Flowers in vases
    () => {
      const vases = rand(2, Math.min(5, Math.ceil(max / 4)));
      const each = rand(2, Math.min(6, Math.ceil(max / vases)));
      const correct = vases * each;
      return {
        id: uniqueId(),
        question: `${vases} vases each have\n${each} flowers.\nHow many flowers in all?`,
        options: makeOptions(correct, Math.max(4, correct)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${vases} × ${each} = ${correct} flowers!`, emoji: "🌷",
      };
    },
    // 7. Total legs (cats)
    () => {
      const cats = rand(2, Math.min(7, Math.ceil(max / 4)));
      const correct = cats * 4;
      return {
        id: uniqueId(),
        question: `A cat has 4 legs.\nHow many legs\ndo ${cats} cats have?`,
        options: makeOptions(correct, Math.max(4, correct)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${cats} × 4 = ${correct} legs!`, emoji: "🐱",
      };
    },
    // 8. More/fewer comparison
    () => {
      const a = rand(5, Math.min(max, 25));
      const diff = rand(1, Math.min(10, a - 1));
      const b = a - diff;
      const correct = diff;
      return {
        id: uniqueId(),
        question: `Jake has ${a} cards.\nMia has ${b} cards.\nHow many more does Jake have?`,
        options: makeOptions(correct, Math.max(4, correct + 2)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${a} − ${b} = ${correct} more cards!`, emoji: "🃏",
      };
    },
  ];

  const medium: Template[] = [
    // 9. Age word problem
    () => {
      const myAge = rand(6, 12);
      const diff = rand(1, 5);
      const sibAge = myAge + diff;
      const correct = sibAge;
      return {
        id: uniqueId(),
        question: `I am ${myAge} years old.\nMy sister is ${diff} years\nolder than me. How old is she?`,
        options: makeOptions(correct, Math.max(4, 4)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${myAge} + ${diff} = ${correct} years old!`, emoji: "👧",
      };
    },
    // 10. Boxes stacked
    () => {
      const boxes = rand(2, Math.min(max, 6));
      const weight = rand(2, 10);
      const correct = boxes * weight;
      return {
        id: uniqueId(),
        question: `Each box weighs ${weight} kg.\nThere are ${boxes} boxes.\nWhat is the total weight?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${boxes} × ${weight} = ${correct} kg!`, emoji: "📦",
      };
    },
    // 11. Stickers on pages
    () => {
      const pages = rand(2, Math.min(8, Math.ceil(max / 5)));
      const each = rand(2, Math.min(10, Math.ceil(max / pages)));
      const correct = pages * each;
      return {
        id: uniqueId(),
        question: `A book has ${pages} pages.\nEach page has ${each} stickers.\nHow many stickers in total?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${pages} × ${each} = ${correct} stickers!`, emoji: "📖",
      };
    },
    // 12. Half of a number
    () => {
      const full = rand(2, Math.min(max, 40)) * 2;
      const correct = full / 2;
      return {
        id: uniqueId(),
        question: `What is half of ${full}?`,
        options: makeOptions(correct, Math.max(4, Math.round(correct * 0.3))),
        correctAnswer: String(correct), category: "logic",
        explanation: `${full} ÷ 2 = ${correct}!`, emoji: "½",
      };
    },
    // 13. Train carriages
    () => {
      const trains = rand(2, Math.min(5, Math.ceil(max / 8)));
      const carriages = rand(3, 8);
      const correct = trains * carriages;
      return {
        id: uniqueId(),
        question: `Each train has ${carriages} carriages.\nThere are ${trains} trains.\nHow many carriages altogether?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${trains} × ${carriages} = ${correct} carriages!`, emoji: "🚂",
      };
    },
    // 14. Seats in rows
    () => {
      const rows = rand(3, Math.min(max / 3, 10));
      const seats = rand(3, Math.min(max / rows, 8));
      const correct = rows * seats;
      return {
        id: uniqueId(),
        question: `A cinema has ${rows} rows\nwith ${seats} seats each.\nHow many seats in total?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${rows} × ${seats} = ${correct} seats!`, emoji: "🎬",
      };
    },
  ];

  const advanced: Template[] = [
    // 15. Time difference
    () => {
      const startH = rand(8, 14);
      const durH = rand(1, 4);
      const endH = startH + durH;
      const correct = endH;
      return {
        id: uniqueId(),
        question: `A film starts at ${startH}:00.\nIt lasts ${durH} hours.\nWhat time does it end?`,
        options: makeOptions(correct, Math.max(4, 3)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${startH} + ${durH} = ${correct}:00!`, emoji: "🎥",
      };
    },
    // 16. Remainder problem
    () => {
      const kids = rand(3, 6);
      const extra = rand(1, kids - 1);
      const total = kids * rand(2, 8) + extra;
      const correct = extra;
      return {
        id: uniqueId(),
        question: `${total} oranges shared\namong ${kids} kids equally.\nHow many are left over?`,
        options: makeOptions(correct, Math.max(4, kids - 1)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${total} ÷ ${kids} = ${Math.floor(total / kids)} remainder ${correct}!`, emoji: "🍊",
      };
    },
    // 17. Perimeter
    () => {
      const side = rand(3, Math.min(max / 4, 15));
      const correct = side * 4;
      return {
        id: uniqueId(),
        question: `A square has sides\nof ${side} cm each.\nWhat is the perimeter?`,
        options: makeOptions(correct, Math.max(5, 8)),
        correctAnswer: String(correct), category: "logic",
        explanation: `4 × ${side} = ${correct} cm perimeter!`, emoji: "⬛",
      };
    },
    // 18. Money: buying multiple
    () => {
      const price = rand(5, 20);
      const qty = rand(2, 8);
      const total = price * qty;
      const paid = (Math.ceil(total / 10) + rand(1, 3)) * 10;
      const correct = paid - total;
      return {
        id: uniqueId(),
        question: `${qty} items cost £${price} each.\nYou pay £${paid}.\nWhat is your change?`,
        options: makeOptions(correct, Math.max(5, Math.round(correct * 0.5))),
        correctAnswer: String(correct), category: "logic",
        explanation: `${qty} × £${price} = £${total}, change = £${paid} − £${total} = £${correct}!`, emoji: "💳",
      };
    },
    // 19. Two-step problem
    () => {
      const initial = rand(20, Math.min(max, 80));
      const gained = rand(5, 20);
      const lost = rand(3, Math.min(gained + initial - 1, 25));
      const correct = initial + gained - lost;
      return {
        id: uniqueId(),
        question: `Start with ${initial} points.\nGain ${gained} more.\nLose ${lost}.\nHow many points now?`,
        options: makeOptions(correct, Math.max(5, Math.round(correct * 0.2))),
        correctAnswer: String(correct), category: "logic",
        explanation: `${initial} + ${gained} − ${lost} = ${correct} points!`, emoji: "🎮",
      };
    },
    // 20. Speed/distance
    () => {
      const speed = pick([2, 3, 4, 5]);
      const time = rand(2, 6);
      const correct = speed * time;
      return {
        id: uniqueId(),
        question: `A snail moves ${speed} cm\nevery minute.\nHow far in ${time} minutes?`,
        options: makeOptions(correct, Math.max(5, correct)),
        correctAnswer: String(correct), category: "logic",
        explanation: `${speed} × ${time} = ${correct} cm!`, emoji: "🐌",
      };
    },
  ];

  let pool: Template[] = [...basic];
  if (age >= 8) pool = [...pool, ...medium];
  if (age >= 10) pool = [...pool, ...advanced];

  return pick(pool)();
}

// ─── PATTERNS ────────────────────────────────────────────────────────────────

export function generatePatternQuestion(age: number): Question {
  const cfg = AGE_CONFIG[age];
  const maxStep = Math.max(2, Math.min(20, Math.round(cfg.addMax / 8)));

  type Template = () => { sequence: number[]; next: number; rule: string };

  const allPatterns: Template[] = [
    // 1. Add step (ascending)
    () => {
      const start = rand(1, Math.min(30, cfg.addMax / 4));
      const step = rand(1, maxStep);
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      return { sequence: seq, next: start + 4 * step, rule: `+${step} each time` };
    },
    // 2. Subtract step (descending)
    () => {
      const step = rand(1, maxStep);
      const start = rand(step * 4 + 1, Math.min(cfg.addMax, step * 10 + 20));
      const seq = [start, start - step, start - 2 * step, start - 3 * step];
      return { sequence: seq, next: Math.max(0, start - 4 * step), rule: `−${step} each time` };
    },
    // 3. Double each term
    () => {
      const base = rand(1, Math.min(4, maxStep));
      const seq = [base, base * 2, base * 4, base * 8];
      return { sequence: seq, next: base * 16, rule: "×2 each time" };
    },
    // 4. Skip by 2 (even numbers)
    () => {
      const start = rand(1, 10) * 2;
      const seq = [start, start + 2, start + 4, start + 6];
      return { sequence: seq, next: start + 8, rule: "+2 each time" };
    },
    // 5. Skip by 5
    () => {
      const start = rand(0, 4) * 5;
      const seq = [start, start + 5, start + 10, start + 15];
      return { sequence: seq, next: start + 20, rule: "+5 each time" };
    },
    // 6. Odd numbers
    () => {
      const start = rand(0, 6) * 2 + 1;
      const seq = [start, start + 2, start + 4, start + 6];
      return { sequence: seq, next: start + 8, rule: "+2 (odd numbers)" };
    },
    // 7. Add increasing step (triangular)
    () => {
      const base = rand(1, 5);
      const seq = [base, base + 1, base + 1 + 2, base + 1 + 2 + 3];
      return { sequence: seq, next: seq[3] + 4, rule: "add 1 more each step" };
    },
    // 8. Multiply by 3
    () => {
      const base = rand(1, 2);
      const seq = [base, base * 3, base * 9, base * 27];
      return { sequence: seq, next: base * 81, rule: "×3 each time" };
    },
    // 9. Powers of 2
    () => {
      const seq = [1, 2, 4, 8];
      return { sequence: seq, next: 16, rule: "×2 each time (powers of 2)" };
    },
    // 10. Alternating add (e.g. +2, +3, +2, +3)
    () => {
      const a = rand(1, Math.min(4, maxStep));
      const b = rand(a + 1, Math.min(6, maxStep + 2));
      const start = rand(1, 10);
      const seq = [start, start + a, start + a + b, start + a + b + a];
      return { sequence: seq, next: start + a + b + a + b, rule: `+${a}, +${b} alternating` };
    },
    // 11. Squares
    () => {
      const seq = [1, 4, 9, 16];
      return { sequence: seq, next: 25, rule: "square numbers (1², 2², 3², ...)" };
    },
    // 12. Fibonacci-like
    () => {
      const a = rand(1, 4);
      const b = rand(1, 4);
      const c = a + b;
      const d = b + c;
      const seq = [a, b, c, d];
      return { sequence: seq, next: c + d, rule: "each number = sum of previous two" };
    },
    // 13. Add step large
    () => {
      const start = rand(10, Math.min(cfg.addMax, 80));
      const step = rand(Math.ceil(maxStep / 2), maxStep);
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      return { sequence: seq, next: start + 4 * step, rule: `+${step} each time` };
    },
    // 14. Subtract from large number
    () => {
      const step = rand(Math.ceil(maxStep / 2), maxStep);
      const start = rand(step * 5, Math.min(cfg.addMax, step * 10 + 50));
      const seq = [start, start - step, start - 2 * step, start - 3 * step];
      return { sequence: seq, next: Math.max(0, start - 4 * step), rule: `−${step} each time` };
    },
    // 15. Skip by 10
    () => {
      const start = rand(0, 9);
      const seq = [start, start + 10, start + 20, start + 30];
      return { sequence: seq, next: start + 40, rule: "+10 each time" };
    },
    // 16. Skip by 100
    () => {
      const start = rand(0, 4) * 100;
      const seq = [start, start + 100, start + 200, start + 300];
      return { sequence: seq, next: start + 400, rule: "+100 each time" };
    },
  ];

  // Filter to age-appropriate patterns
  let pool: Template[];
  if (age <= 8) {
    pool = allPatterns.slice(0, 6);
  } else if (age <= 10) {
    pool = allPatterns.slice(0, 11);
  } else {
    pool = allPatterns;
  }

  const { sequence, next: correct, rule } = pick(pool)();

  return {
    id: uniqueId(),
    question: `What comes next?\n${sequence.join(" → ")} → ?`,
    options: makeOptions(correct, Math.max(4, Math.round(Math.max(correct, 4) * 0.35))),
    correctAnswer: String(correct),
    category: "patterns",
    explanation: `The rule is: ${rule}. Next = ${correct}!`,
    emoji: "🔢",
  };
}

// ─── main entry ──────────────────────────────────────────────────────────────

export function generateQuestion(category: Category, age: number): Question {
  switch (category) {
    case "addition":       return generateAdditionQuestion(age);
    case "subtraction":    return generateSubtractionQuestion(age);
    case "multiplication": return generateMultiplicationQuestion(age);
    case "logic":          return generateLogicQuestion(age);
    case "patterns":       return generatePatternQuestion(age);
  }
}
