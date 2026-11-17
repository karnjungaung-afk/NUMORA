export interface CharacterProgress {
  level: number;
  xp: number;
  nextXp: number;
  progress: number;
  maxed: boolean;
}

/** Character XP is cumulative in the save file; the display shows XP within the current level. */
export function getCharacterProgress(totalXp: number): CharacterProgress {
  let remaining = Math.max(0, Math.floor(totalXp));
  let level = 1;
  while (level < 30) {
    const nextXp = 50 + level * 50;
    if (remaining < nextXp) {
      return { level, xp: remaining, nextXp, progress: Math.round((remaining / nextXp) * 100), maxed: false };
    }
    remaining -= nextXp;
    level += 1;
  }
  return { level: 30, xp: 0, nextXp: 0, progress: 100, maxed: true };
}

export const CHARACTER_XP_REWARDS = {
  victory: 35,
  defeat: 12,
} as const;
