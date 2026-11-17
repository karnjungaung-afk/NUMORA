import { MONSTERS, type Monster, type Rarity } from "../data/monsters";
import type { SaveData, SummonRecord } from "./save";

export const SUMMON_COST = { single: 100, ten: 900 } as const;
export const BASE_RATES: Record<Rarity, number> = {
  common: 52,
  rare: 28,
  epic: 14,
  legendary: 5,
  mythic: 1,
};
export const SHARD_VALUE: Record<Rarity, number> = {
  common: 5,
  rare: 10,
  epic: 25,
  legendary: 50,
  mythic: 120,
};

function baseRarity(): Rarity {
  const roll = Math.random() * 100;
  if (roll < BASE_RATES.mythic) return "mythic";
  if (roll < BASE_RATES.mythic + BASE_RATES.legendary) return "legendary";
  if (roll < BASE_RATES.mythic + BASE_RATES.legendary + BASE_RATES.epic) return "epic";
  if (roll < BASE_RATES.mythic + BASE_RATES.legendary + BASE_RATES.epic + BASE_RATES.rare) return "rare";
  return "common";
}

function pickMonster(rarity: Rarity): Monster {
  const pool = MONSTERS.filter((monster) => monster.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)] ?? MONSTERS[0]!;
}

export interface SummonBatch {
  save: SaveData;
  results: Array<{ monster: Monster; duplicate: boolean; shards: number; guaranteed: boolean }>;
}

export function summonBatch(current: SaveData, count: 1 | 10): SummonBatch | null {
  const cost = count === 1 ? SUMMON_COST.single : SUMMON_COST.ten;
  if (current.coins < cost) return null;

  let next: SaveData = {
    ...current,
    coins: current.coins - cost,
    owned: [...current.owned],
    shards: { ...current.shards },
    epicPity: current.epicPity,
    legendaryPity: current.legendaryPity,
    mythicPity: current.mythicPity ?? 0,
    monsterXp: { ...current.monsterXp },
    history: [...current.history],
  };
  const results: SummonBatch["results"] = [];

  for (let index = 0; index < count; index += 1) {
    const base = baseRarity();
    const reachesEpicPity = next.epicPity + 1 >= 10;
    const reachesLegendaryPity = next.legendaryPity + 1 >= 50;
    const reachesMythicPity = next.mythicPity + 1 >= 100;
    let rarity = base;
    let guaranteed = false;

    if (reachesMythicPity) {
      rarity = "mythic";
      guaranteed = true;
    } else if (reachesLegendaryPity && base !== "mythic") {
      rarity = "legendary";
      guaranteed = true;
    } else if (reachesEpicPity && base !== "epic" && base !== "legendary" && base !== "mythic") {
      rarity = "epic";
      guaranteed = true;
    }

    const monster = pickMonster(rarity);
    const duplicate = next.owned.includes(monster.id);
    const shards = duplicate ? SHARD_VALUE[rarity] : 0;

    if (duplicate) {
      next.shards[monster.id] = (next.shards[monster.id] ?? 0) + shards;
    } else {
      next.owned.push(monster.id);
    }

    next.mythicPity = rarity === "mythic" ? 0 : next.mythicPity + 1;
    if (rarity === "legendary" || rarity === "mythic") {
      next.legendaryPity = 0;
      next.epicPity = 0;
    } else {
      next.legendaryPity += 1;
      next.epicPity = rarity === "epic" ? 0 : next.epicPity + 1;
    }

    const record: SummonRecord = {
      id: Date.now().toString(36) + "-" + index + "-" + Math.random().toString(36).slice(2, 7),
      monsterId: monster.id,
      date: Date.now(),
      duplicate,
      rarity,
    };
    next.history.unshift(record);
    results.push({ monster, duplicate, shards, guaranteed });
  }

  next.history = next.history.slice(0, 40);
  return { save: next, results };
}

export function upgradeCost(level: number): number {
  return 20 * (level + 1);
}