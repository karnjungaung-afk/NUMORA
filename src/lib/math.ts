export type MathCategory = "add" | "multiply" | "equation";
export type Difficulty = "easy" | "normal" | "hard";

export interface MathQuestion {
  prompt: string;
  answer: number;
  category: MathCategory;
  hint: string;
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function createQuestion(category: MathCategory, difficulty: Difficulty): MathQuestion {
  const range = difficulty === "easy" ? 12 : difficulty === "normal" ? 35 : 100;
  if (category === "add") {
    const a = randomInt(3, range);
    const b = randomInt(2, range);
    if (Math.random() > 0.5) return { prompt: a + " + " + b + " = ?", answer: a + b, category, hint: "ลองรวมจำนวนทั้งสองเข้าด้วยกัน" };
    const hi = Math.max(a, b);
    const lo = Math.min(a, b);
    return { prompt: hi + " − " + lo + " = ?", answer: hi - lo, category, hint: "นำจำนวนที่น้อยกว่าออกจากจำนวนที่มากกว่า" };
  }
  if (category === "multiply") {
    const max = difficulty === "easy" ? 6 : difficulty === "normal" ? 10 : 14;
    const a = randomInt(2, max);
    const b = randomInt(2, max);
    return Math.random() > 0.5
      ? { prompt: a + " × " + b + " = ?", answer: a * b, category, hint: "การคูณคือการบวกจำนวนเดิมซ้ำ ๆ" }
      : { prompt: (a * b) + " ÷ " + a + " = ?", answer: b, category, hint: "ลองหาจำนวนที่คูณกับตัวหารแล้วได้ตัวตั้ง" };
  }
  const x = randomInt(1, difficulty === "hard" ? 12 : 8);
  const a = randomInt(2, difficulty === "easy" ? 4 : 8);
  const b = randomInt(1, range);
  return { prompt: a + "x + " + b + " = " + (a * x + b) + "  |  x = ?", answer: x, category, hint: "ย้ายค่าคงที่ไปอีกข้าง แล้วหารด้วยสัมประสิทธิ์ของ x" };
}

export function isCorrectAnswer(question: MathQuestion, input: string): boolean {
  const normalized = input.trim().replace(/[๐-๙]/g, (digit) => String("๐๑๒๓๔๕๖๗๘๙".indexOf(digit)));
  if (!/^-?\d+$/.test(normalized)) return false;
  return Number(normalized) === question.answer;
}