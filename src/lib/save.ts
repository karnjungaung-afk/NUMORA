import type { Rarity } from "../data/monsters";

export interface SummonRecord {
  id: string;
  monsterId: string;
  date: number;
  duplicate: boolean;
  rarity: Rarity;
}
export interface SaveData {
  coins: number;
  xp: number;
  level: number;
  wins: number;
  losses: number;
  owned: string[];
  selected: string;
  shards: Record<string, number>;
  upgrades: Record<string, number>;
  epicPity: number;
  legendaryPity: number;
  mythicPity: number;
  monsterXp: Record<string, number>;
  history: SummonRecord[];
  sound: boolean;
  timed: boolean;
  difficulty: "easy" | "normal" | "hard";
}
export const STORAGE_KEY = "numora-save-v1";
export const DEFAULT_SAVE: SaveData = {
  coins: 420, xp: 0, level: 1, wins: 0, losses: 0,
  owned: ["mossbit", "embercub", "bubblit"], selected: "mossbit",
  shards: {}, upgrades: {}, epicPity: 0, legendaryPity: 0, mythicPity: 0, monsterXp: {}, history: [],
  sound: true, timed: true, difficulty: "easy",
};

export function loadSave(): SaveData {
  if (typeof window === "undefined") return DEFAULT_SAVE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SAVE;
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      owned: Array.isArray(parsed.owned) ? parsed.owned : DEFAULT_SAVE.owned,
      shards: parsed.shards && typeof parsed.shards === "object" ? parsed.shards : {},
      upgrades: parsed.upgrades && typeof parsed.upgrades === "object" ? parsed.upgrades : {},
      monsterXp: parsed.monsterXp && typeof parsed.monsterXp === "object" ? parsed.monsterXp : {},
      mythicPity: typeof parsed.mythicPity === "number" ? parsed.mythicPity : 0,
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, 40) : [],
    };
  } catch {
    return DEFAULT_SAVE;
  }
}

export function saveGame(data: SaveData) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* browser storage may be disabled */ }
}