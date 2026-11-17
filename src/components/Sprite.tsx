import type { CSSProperties } from "react";
import type { Monster, Shape } from "../data/monsters";

interface Props {
  monster: Monster;
  size?: number;
  className?: string;
  stage?: number;
}

/**
 * Original 16x16 pixel sprites. Every glyph is a deliberately placed pixel:
 * o = outline, b = body, s = shadow, l = highlight, a = accent,
 * e = eye, w = eye shine. Rows are centered on a 16-pixel canvas.
 */
const PIXEL_ART: Record<Shape, string[]> = {
  slime: [
    "....oooo....",
    "..ooobbbboo..",
    ".oobbbbbbbboo.",
    "oobbbbbbbbbboo",
    "obbbllbbbbllbo",
    "obbbllbbbbllbo",
    "obbbbbbbbbbbbo",
    "obbbbbbbbbbbbo",
    ".obbbbabb bbbo".replace(/ /g, ""),
    ".obbbbbbbbbbo.",
    "..oobbbbbboo..",
    "...oo....oo...",
  ],
  wolf: [
    "...oo......oo...",
    "..oboo....oobo..",
    ".oobbbboooobboo.",
    "oobbbbbbbbbbbboo",
    "obbbllbbbbllbbbo",
    "obbbllbbbbllbbbo",
    "obbbbbebbbbbbbbo",
    "obbbbbbbbbbbbbbo",
    ".obbbbbabb bbbbo".replace(/ /g, ""),
    "..obbbbbbbbbbo..",
    "...oobbbbbboo...",
    "....oo....oo....",
  ],
  dragon: [
    "....oo....oo....",
    "...oabo..obao...",
    "..oabbbboobbb ao".replace(/ /g, ""),
    ".oobbbbbbbbbboo.",
    "oobbbbbbbbbbbboo",
    "obbbllbbbbllbbbo",
    "obbbllbbbbllbbbo",
    "obbbbbebbbbbbbbo",
    ".obbbbbbbbbbbbo.",
    "..obbbbbbabbbo..",
    "...obbbbbbbbo...",
    "..ooobbbbbooo...",
    ".oo..o....o..oo.",
  ],
  bird: [
    "......oooo......",
    ".....oabbao.....",
    "....oabbbbao....",
    "...oobbbbbboo...",
    "..oobbbllbbboo..",
    ".oobbbbllbbbbboo.",
    "oobbbbbbbbbbbbboo",
    "oobbbbebbbbbbbboo",
    ".oobbbbbbbbbbbboo",
    "..oobbbbbbbboo..",
    "...oobbbbbboo...",
    ".....oo..oo.....",
  ],
  knight: [
    ".....oooooo.....",
    "....oabbbb ao...".replace(/ /g, ""),
    "...oobbbbbbboo...",
    "..oobbbllbbbboo..",
    "..obbbbbebbbbbo..",
    "..obbbbbbbbbbbbo.",
    "...obbbbabbbbbo..",
    "....obbbbbbbbo...",
    "....oobbbbbboo....",
    "...oobbbbbbbboo...",
    "...obbbboobbbbo...",
    "...ooo......ooo...",
  ],
  mage: [
    "......oooo......",
    ".....oabbao.....",
    "....oabbbb ao....".replace(/ /g, ""),
    "...oobbbbbboo...",
    "..oobbbllbbboo..",
    "..obbbbebbbbbo..",
    "..obbbbbbbbbbo..",
    "...obbbbbbbbo...",
    "....obbbbbbo....",
    "...oobbbbbboo...",
    "..oobbbbbbbbboo..",
    ".oo..oo..oo..oo.",
  ],
  beast: [
    "....oo....oo....",
    "...oabbo..obao...",
    "..oobbbbbbbbbboo..",
    ".oobbbbbbbbbbbboo.",
    "oobbbllbbbbllbbboo",
    "obbbllbbbbllbbbbo",
    "obbbbbebbbbbbbbbo",
    "obbbbbbbbbbbbbbbbo",
    ".obbbbbabb bbbbbbo".replace(/ /g, ""),
    "..obbbbbbbbbbbbo..",
    "...oobbbbbboo...",
    "..oo..o....o..oo..",
  ],
  phantom: [
    "......oooo......",
    ".....oabbao.....",
    "....oabbbb ao....".replace(/ /g, ""),
    "...oobbbbbboo...",
    "..oobbbllbbboo..",
    "..obbbbebbbbbo..",
    "..obbbbbbbbbbo..",
    "...obbbbbbbbo...",
    "...obbbbbbbbo...",
    "..obbbboobbbbo..",
    ".oobbo....obboo.",
    "oo............oo",
  ],
  golem: [
    ".....oooooo.....",
    "....oabbbb ao....".replace(/ /g, ""),
    "...oobbbbbboo...",
    "..oobbbllbbboo..",
    "..obbbbebbbbbo..",
    "..obbbbbbbbbbo..",
    ".oobbbabbbbbboo.",
    "oobbbbbbbbbbbboo",
    "obbbbbbbbbbbbbbo",
    "obbbbboobbbbbbbbo",
    "..ooo......ooo..",
  ],
  fox: [
    "...oo...........",
    "..oabo......oo..",
    ".oabbbbo...oabo.",
    "oobbbbbbo.oabboo",
    "obbbllbbboobbbbo",
    "obbbllbbbbbbbbbbo",
    "obbbbbebbbbbbbbo",
    ".obbbbbbbbbbbbo.",
    "..obbbbbabbbbo..",
    "...oobbbbbboo...",
    "....oobbbboo.....",
    "...oo......oo...",
  ],
  serpent: [
    "......oooo......",
    ".....oabboo.....",
    "....oabbbboo....",
    "...oobbbbbboo...",
    "...obbbllbbbo....",
    "....obbbbbbo.....",
    ".....oobboo......",
    "......obbo.......",
    ".....oobboo......",
    "....oobbbboo.....",
    "...oobbbbbboo....",
    "...obbbllbbbo....",
    "....obbbbbbo.....",
    ".....oo..oo......",
  ],
  fairy: [
    "oo............oo",
    "oaoo........ooao",
    ".oaboo....oobao.",
    "..oabbb..bbbao..",
    "...oobbbbbboo...",
    "....obbbllbo....",
    "....obbbebbo....",
    "....obbbabbo....",
    ".....obbbbo.....",
    ".....obbbbo.....",
    "....oo....oo....",
    "...oo......oo...",
  ],
  reaper: [
    "......oooo......",
    ".....oabbao.....",
    "....oabbbb ao....".replace(/ /g, ""),
    "...oobbbbbboo...",
    "...obbbllbbbo....",
    "...obbbebbbbo....",
    "....obbbbbbo.....",
    ".....obbbbo......",
    "....oobbbboo.....",
    "...oobbbbbboo....",
    "..oo..obbo..oo...",
    ".oo....oo....oo..",
    ".........oo......",
  ],
  mech: [
    "....oooooooo....",
    "...oabbbbbbao...",
    "..oobbbbbbbbboo..",
    "..obbbllbbllbbbo.",
    "..obbbweebbb bbo".replace(/ /g, ""),
    "..obbbbbbbbbbbbo.",
    ".oobbbbabbbbbboo.",
    "oobbbbbbbbbbbbbboo",
    "obbbbbbbbbbbbbbbbo",
    "..obbbboobbbbo...",
    "..ooo......ooo...",
  ],
  turtle: [
    "......oooo......",
    ".....oabbao.....",
    "...ooobbbbb ooo...".replace(/ /g, ""),
    "..obbbbbbbbbbbbo..",
    ".obbbllbbbbllbbbo.",
    "obbbbbbbbbbbbbbbbo",
    "obbbbbebbbbbbbbbo",
    ".obbbbbbbbbbbbbbbo.",
    "..obbbbabb bbbbo..".replace(/ /g, ""),
    "...ooo......ooo...",
  ],
  beetle: [
    ".....oooooo.....",
    "....oabbbbao....",
    "...oobbbbbboo...",
    "..oobllbbllboo..",
    ".oobbbbbbbbbboo.",
    "oobbbbbebbbbbboo",
    "obbbbbbbbbbbbbbo",
    ".obbbbbabbbbbbo.",
    "..oobbbbbbbboo..",
    "...oo......oo...",
  ],
  deer: [
    "o..o......o..o",
    "oaoo......ooao",
    ".oaboo....oobao",
    "..oabbb..bbbao..",
    "...oobbbbbboo...",
    "..oobbbllbbboo..",
    "..obbbbebbbbo...",
    "...obbbbbbbbo...",
    "....obbbabbo....",
    "....oobbbboo....",
    "...oo......oo...",
    "..oo........oo..",
  ],
  manta: [
    "......oooo......",
    ".....oabbao.....",
    "...ooobbbboo....",
    "..oobbbbbbbboo..",
    ".oobbbbllbbbbboo.",
    "oobbbbbbbbbbbbbboo",
    "obbbbbebbbbbbbbbbo",
    ".obbbbbbbbbbbbbbbo.",
    "..obbbbbabbbbbbo..",
    "...oobbbbbbbboo...",
    ".....oo....oo.....",
  ],
  samurai: [
    ".....oooooo.....",
    "....oabbbb ao....".replace(/ /g, ""),
    "...oobbbbbbbb o...".replace(/ /g, ""),
    "..oobllbbbbllboo..",
    "...obbbbebbbbo....",
    "....obbbbbbbbo....",
    "...oobbbbabbbboo...",
    "..oobbbbbbbbbboo..",
    "..obbbboobbbbo...",
    "...oo..oo..oo...",
    "...oo......oo...",
  ],
  wisp: [
    "......oooo......",
    ".....oabbao.....",
    "....oabbbbbao....",
    "...oobbbllbbboo...",
    "...obbbbebbbbo....",
    "....obbbbbbo.....",
    "....obbbabbo.....",
    "...oobbbbbboo....",
    "..oobbo..obboo...",
    ".oo..........oo.",
    "........oo......",
  ],
  phoenix: [
    "....oo......oo....",
    "...oabo....oabo...",
    "..oabbbbo..obbb ao".replace(/ /g, ""),
    ".oobbbbbboobbbbbboo.",
    "oobbbllbbbbllbbbboo",
    "obbbbbbbbbbbbbbbbo",
    "..obbbbebbbbbo...",
    "...obbbbbbbbo....",
    "....obbbabbo.....",
    "...oo..oo..oo...",
    "..oo........oo..",
  ],
  hydra: [
    "..oooo....oooo....",
    ".oabbao..oabbao...",
    "..obbbbo..obbbbo..",
    "...oobbbbbbbboo...",
    "....obbbbbbbbo....",
    "..oobbbllbbllbbboo..",
    ".oobbbbbebbbbbbbboo.",
    "obbbbbbbbbbbbbbbbbbo",
    ".obbbbbbbbbbbbbbbbo.",
    "..obbbbabbbbbbo...",
    "...oobbbbbbbboo...",
    "....oo......oo....",
  ],
  clockwork: [
    "....oooooooo....",
    "...oabbbbbbao...",
    "..oobllbbllbboo..",
    ".oobbbbbbbbbbbboo.",
    "obbbbbebbbbbbbbbo",
    "obbbbabbbbabb bbbo".replace(/ /g, ""),
    "obbbbbbbbbbbbbbbbo",
    ".obbbbbbbbbbbbbo.",
    "..obbbboobbbbo...",
    "...ooo......ooo...",
  ],
  angel: [
    "oo............oo",
    "oaoo........ooao",
    ".oaboo......oobao",
    "..oabbbboobbbbao..",
    "...oobbbllbbboo...",
    "....obbbbebbo....",
    "....obbbbbbo.....",
    "...oobbbabbbboo...",
    "..oobbbbbbbbbboo..",
    "..oo..obbo..oo....",
    ".oo...oo..oo...oo.",
  ],
  crystal: [
    ".......oo.......",
    "......oabo......",
    ".....oabbb o.....".replace(/ /g, ""),
    "....oobbbbbboo...",
    "...oobbbllbbboo..",
    "..oobbbbbbabbboo.",
    ".oobbbbbbbbbbbboo",
    "..obbbbbbbbbbbbo.",
    "...obbbbbbbbbo...",
    "....obbbbbbo....",
    ".....oobboo.....",
    "......oooo......",
  ],
};

const PALETTE: Record<string, (monster: Monster) => string> = {
  o: (m) => m.colors.shade,
  s: (m) => m.colors.shade,
  b: (m) => m.colors.body,
  l: (m) => m.colors.light,
  a: (m) => m.colors.accent,
  e: () => "#171426",
  w: () => "#ffffff",
};

function centerRow(row: string): string {
  const start = Math.max(0, Math.floor((row.length - 16) / 2));
  const trimmed = row.slice(start, start + 16);
  const left = Math.floor((16 - trimmed.length) / 2);
  return ".".repeat(left) + trimmed + ".".repeat(16 - left - trimmed.length);
}

export default function Sprite({ monster, size = 116, className = "", stage = 0 }: Props) {
  const rows = PIXEL_ART[monster.shape].map(centerRow);
  const pixels: Array<{ x: number; y: number; color: string }> = [];

  rows.forEach((row, y) => {
    [...row].forEach((glyph, x) => {
      const color = PALETTE[glyph]?.(monster);
      if (color) pixels.push({ x, y, color });
    });
  });

  const style: CSSProperties = {
    width: size,
    height: size,
    imageRendering: "pixelated",
    filter: "drop-shadow(0 5px 0 rgba(0,0,0,.35))",
  };

  const evolution = Math.max(0, Math.min(3, Math.floor(stage)));
  const accents: Array<{ x: number; y: number; w: number; h: number; color: string }> = [];
  const wings: Array<{ x: number; y: number; w: number; h: number; color: string }> = [];
  if (evolution >= 1) accents.push(
    { x: 6, y: 0, w: 4, h: 1, color: monster.colors.accent },
    { x: 7, y: -1, w: 2, h: 1, color: monster.colors.light },
    { x: 1, y: 7, w: 2, h: 2, color: monster.colors.accent },
    { x: 13, y: 7, w: 2, h: 2, color: monster.colors.accent },
    { x: 3, y: 12, w: 2, h: 1, color: monster.colors.light },
    { x: 11, y: 12, w: 2, h: 1, color: monster.colors.light },
  );
  if (evolution >= 2) wings.push(
    { x: 0, y: 4, w: 3, h: 1, color: monster.colors.light },
    { x: -1, y: 5, w: 4, h: 2, color: monster.colors.body },
    { x: 0, y: 7, w: 3, h: 1, color: monster.colors.accent },
    { x: 13, y: 4, w: 3, h: 1, color: monster.colors.light },
    { x: 13, y: 5, w: 4, h: 2, color: monster.colors.body },
    { x: 13, y: 7, w: 3, h: 1, color: monster.colors.accent },
    { x: 5, y: 1, w: 2, h: 1, color: monster.colors.accent },
    { x: 9, y: 1, w: 2, h: 1, color: monster.colors.accent },
  );
  if (evolution >= 3) wings.push(
    { x: -2, y: 3, w: 4, h: 1, color: monster.colors.light },
    { x: -2, y: 4, w: 5, h: 1, color: monster.colors.accent },
    { x: -3, y: 5, w: 5, h: 2, color: monster.colors.body },
    { x: -2, y: 7, w: 4, h: 1, color: monster.colors.shade },
    { x: 14, y: 3, w: 4, h: 1, color: monster.colors.light },
    { x: 13, y: 4, w: 5, h: 1, color: monster.colors.accent },
    { x: 14, y: 5, w: 5, h: 2, color: monster.colors.body },
    { x: 14, y: 7, w: 4, h: 1, color: monster.colors.shade },
    { x: 6, y: -2, w: 4, h: 1, color: monster.colors.light },
    { x: 5, y: -1, w: 6, h: 1, color: monster.colors.accent },
    { x: 7, y: -3, w: 2, h: 1, color: monster.colors.light },
    { x: 2, y: 14, w: 3, h: 1, color: monster.colors.accent },
    { x: 11, y: 14, w: 3, h: 1, color: monster.colors.accent },
  );
  return (
    <svg
      className={"sprite pixel-sprite evolve-sprite evolve-stage-" + evolution + " " + className}
      style={style}
      viewBox={evolution >= 3 ? "-3 -3 22 22" : evolution >= 2 ? "-1 -1 18 18" : "0 0 16 16"}
      role="img"
      aria-label={monster.name + (evolution ? " " + ["", "Awakened", "Ascendant", "Ultimate"][evolution] : "")}
      shapeRendering="crispEdges"
    >
      {wings.map((part, index) => <rect key={"wing-" + index} x={part.x} y={part.y} width={part.w} height={part.h} fill={part.color} stroke={monster.colors.shade} strokeWidth=".25" />)}
      {pixels.map((pixel) => (
        <rect key={pixel.x + "-" + pixel.y} x={pixel.x} y={pixel.y} width="1" height="1" fill={pixel.color} />
      ))}
      {accents.map((part, index) => <rect key={"armor-" + index} x={part.x} y={part.y} width={part.w} height={part.h} fill={part.color} stroke={monster.colors.shade} strokeWidth=".25" />)}
      {evolution >= 3 && <g fill="none" stroke={monster.colors.light} strokeWidth=".55" opacity=".95"><path d="M4 -1 H12 M3 0 H13 M4 1 H12" /><path d="M2 3 L0 1 M14 3 L16 1" /></g>}
    </svg>
  );
}