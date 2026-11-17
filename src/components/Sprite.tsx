import type { CSSProperties } from "react";
import type { Monster, Shape } from "../data/monsters";

interface Props {
  monster: Monster;
  size?: number;
  className?: string;
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

export default function Sprite({ monster, size = 116, className = "" }: Props) {
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

  return (
    <svg
      className={"sprite pixel-sprite " + className}
      style={style}
      viewBox="0 0 16 16"
      role="img"
      aria-label={monster.name}
      shapeRendering="crispEdges"
    >
      {pixels.map((pixel) => (
        <rect key={pixel.x + "-" + pixel.y} x={pixel.x} y={pixel.y} width="1" height="1" fill={pixel.color} />
      ))}
    </svg>
  );
}