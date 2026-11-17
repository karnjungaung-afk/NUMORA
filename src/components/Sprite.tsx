import type { CSSProperties } from "react";
import type { Monster } from "../data/monsters";

interface Props { monster: Monster; size?: number; className?: string; }

function inside(shape: Monster["shape"], x: number, y: number): boolean {
  const dx = (x - 7.5) / 6.5;
  const dy = (y - 8) / 6.5;
  const core = dx * dx + dy * dy < 1 && y > 2;
  if (shape === "dragon") return core || (y < 5 && (x === 3 || x === 4 || x === 11 || x === 12)) || (x > 11 && y > 8 && y < 12);
  if (shape === "wolf" || shape === "beast") return core || (y < 5 && (x === 3 || x === 4 || x === 11 || x === 12)) || (x < 2 && y > 8 && y < 11);
  if (shape === "bird") return (core && !(x < 4 && y > 8)) || (y > 6 && y < 11 && (x < 3 || x > 12)) || (y < 5 && (x === 5 || x === 10));
  if (shape === "knight" || shape === "golem") return x >= 3 && x <= 12 && y >= 3 && y <= 13 || (y === 2 && x >= 5 && x <= 10) || (y > 9 && (x === 3 || x === 12));
  if (shape === "mage" || shape === "phantom") return (core && y > 4) || (y >= 2 && y <= 5 && x >= 3 && x <= 12) || (y > 11 && x >= 2 && x <= 13 && (x + y) % 2 === 0);
  return core;
}

export default function Sprite({ monster, size = 116, className = "" }: Props) {
  const cells: { x: number; y: number; fill: string }[] = [];
  for (let y = 0; y < 16; y += 1) {
    for (let x = 0; x < 16; x += 1) {
      if (!inside(monster.shape, x, y)) continue;
      const outer = !inside(monster.shape, Math.max(0, Math.min(15, x - 1)), y) ||
        !inside(monster.shape, Math.max(0, Math.min(15, x + 1)), y) ||
        !inside(monster.shape, x, Math.max(0, y - 1)) ||
        !inside(monster.shape, x, Math.min(15, y + 1));
      let fill = outer ? monster.colors.shade : monster.colors.body;
      if (!outer && y < 6 && (x + y) % 4 === 0) fill = monster.colors.light;
      if (!outer && y > 9 && y < 13 && x > 4 && x < 11) fill = monster.colors.light;
      if ((x === 5 || x === 10) && y === 7) fill = "#17192c";
      if ((x === 6 || x === 11) && y === 6) fill = "#ffffff";
      if ((x === 7 || x === 9) && y === 11) fill = monster.colors.accent;
      if ((monster.shape === "dragon" || monster.shape === "knight") && y === 3 && (x === 4 || x === 11)) fill = monster.colors.accent;
      cells.push({ x, y, fill });
    }
  }
  const style: CSSProperties = { width: size, height: size, filter: "drop-shadow(0 8px 0 rgba(0,0,0,.22))" };
  return (
    <svg className={"sprite " + className} style={style} viewBox="0 0 16 16" role="img" aria-label={monster.name}>
      {cells.map((cell) => <rect key={cell.x + "-" + cell.y} x={cell.x} y={cell.y} width="1" height="1" fill={cell.fill} />)}
      <rect x="5" y="8" width="1" height="1" fill="#fff" />
      <rect x="10" y="8" width="1" height="1" fill="#fff" />
    </svg>
  );
}