export type EvolutionStage = 0 | 1 | 2 | 3;
export interface EvolutionBonus { hp: number; atk: number; def: number; }
export interface NextEvolution {
  stage: EvolutionStage; label: string; title: string; requiredLevel: number; shardCost: number; description: string;
}
export const EVOLUTION_STAGES: NextEvolution[] = [
  { stage: 1, label: "STAGE 1 · AWAKENED", title: "ร่างปลุกพลัง", requiredLevel: 10, shardCost: 50, description: "ร่างกายเริ่มเปล่งประกาย พลังชีวิตและพลังโจมตีเพิ่มขึ้น" },
  { stage: 2, label: "STAGE 2 · ASCENDANT", title: "ร่างจุติ", requiredLevel: 20, shardCost: 100, description: "ปลดล็อกปีกและเกราะประจำร่าง รูปลักษณ์เปลี่ยนชัดเจน" },
  { stage: 3, label: "STAGE MAX · ULTIMATE", title: "ร่างสมบูรณ์", requiredLevel: 30, shardCost: 200, description: "ปลดปล่อยพลังขั้นสุดท้าย พร้อมออร่าราชันและร่างแท้จริง" },
];
const BONUSES: Record<EvolutionStage, EvolutionBonus> = {
  0: { hp: 0, atk: 0, def: 0 }, 1: { hp: 10, atk: 3, def: 2 },
  2: { hp: 25, atk: 8, def: 5 }, 3: { hp: 45, atk: 15, def: 9 },
};
export function getEvolutionStage(value: number | undefined): EvolutionStage {
  const stage = Math.floor(value ?? 0);
  return stage >= 3 ? 3 : stage >= 2 ? 2 : stage >= 1 ? 1 : 0;
}
export function getEvolutionBonus(stage: number): EvolutionBonus { return BONUSES[getEvolutionStage(stage)]; }
export function getNextEvolution(stage: number): NextEvolution | null {
  return EVOLUTION_STAGES.find((item) => item.stage === getEvolutionStage(stage) + 1) ?? null;
}
export function getEvolutionLabel(stage: number): string {
  return ["BASE FORM", "STAGE 1", "STAGE 2", "STAGE MAX"][getEvolutionStage(stage)];
}
export function getEvolutionTitle(stage: number): string {
  return ["ร่างเริ่มต้น", "ร่างปลุกพลัง", "ร่างจุติ", "ร่างสมบูรณ์"][getEvolutionStage(stage)];
}
export function getStageForLevel(level: number): EvolutionStage {
  return level >= 30 ? 3 : level >= 20 ? 2 : level >= 10 ? 1 : 0;
}
