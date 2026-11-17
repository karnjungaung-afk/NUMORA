import { useEffect, useMemo, useState } from "react";
import Sprite from "./components/Sprite";
import { ELEMENT_LABEL, MONSTERS, RARITY_COLOR, RARITY_LABEL, getMonster, type Monster, type Rarity } from "./data/monsters";
import { createQuestion, isCorrectAnswer, type MathCategory, type MathQuestion } from "./lib/math";
import { loadSave, saveGame, type SaveData } from "./lib/save";
import { BASE_RATES, SHARD_VALUE, SUMMON_COST, summonBatch, upgradeCost } from "./lib/gacha";
import { CHARACTER_XP_REWARDS, getCharacterProgress } from "./lib/characterProgress";

type View = "home" | "battle" | "summon" | "collection" | "online" | "settings";
type BattlePhase = "choose" | "question" | "won" | "lost";
interface BattleState {
  playerId: string;
  enemyId: string;
  playerLevel: number;
  enemyLevel: number;
  playerHp: number;
  enemyHp: number;
  playerMaxHp: number;
  enemyMaxHp: number;
  phase: BattlePhase;
  question: MathQuestion | null;
  category: MathCategory | null;
  timeLeft: number;
  streak: number;
  log: string[];
}

const categories: Array<{ id: MathCategory; title: string; label: string; glyph: string; power: string }> = [
  { id: "add", title: "บวก / ลบ", label: "ARITHMETIC", glyph: "＋−", power: "สมดุล" },
  { id: "multiply", title: "คูณ / หาร", label: "MULTIPLY", glyph: "×÷", power: "พลังโจมตีสูง" },
  { id: "equation", title: "สมการ", label: "EQUATION", glyph: "x=", power: "ท้าทาย" },
];

function Bar({ value, max, tone = "hp" }: { value: number; max: number; tone?: "hp" | "xp" }) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return <div className={"bar-track " + tone}><div className="bar-fill" style={{ width: width + "%" }} /></div>;
}
function Stat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return <div className="stat-tile"><span className="stat-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>;
}
function rarityText(rarity: Rarity) {
  return RARITY_LABEL[rarity];
}

function App() {
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [view, setView] = useState<View>("home");
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [battleEffect, setBattleEffect] = useState<{ id: number; kind: "hit" | "critical" | "miss"; label: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");
  const [summonResults, setSummonResults] = useState<ReturnType<typeof summonBatch> extends infer T ? T extends { results: infer R } ? R : never : never>([]);
  const [summonBusy, setSummonBusy] = useState(false);
  const [filterRarity, setFilterRarity] = useState<"all" | Rarity>("all");
  const [filterElement, setFilterElement] = useState("all");
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("นักผจญภัย");
  const [showRates, setShowRates] = useState(false);

  useEffect(() => { saveGame(save); }, [save]);

  useEffect(() => {
    if (!battle || battle.phase !== "question" || !save.timed) return;
    const timer = window.setInterval(() => {
      setBattle((current) => current && current.phase === "question"
        ? { ...current, timeLeft: Math.max(0, current.timeLeft - 1) }
        : current);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [battle?.phase, battle?.question?.prompt, save.timed]);

  useEffect(() => {
    if (battle?.phase === "question" && save.timed && battle.timeLeft === 0) {
      resolveAnswer("");
    }
  }, [battle?.timeLeft, battle?.phase]);

  const selected = getMonster(save.selected);
  const xpNeeded = save.level * 100;
  const ownedMonsters = useMemo(() => MONSTERS.filter((monster) => save.owned.includes(monster.id)), [save.owned]);
  const displayedMonsters = useMemo(() => ownedMonsters.filter((monster) =>
    (filterRarity === "all" || monster.rarity === filterRarity) &&
    (filterElement === "all" || monster.element === filterElement)), [ownedMonsters, filterRarity, filterElement]);

  function startBattle() {
    const player = getMonster(save.selected);
    const candidates = MONSTERS.filter((monster) => monster.id !== player.id && monster.stats.atk <= player.stats.atk + 7);
    const enemy = candidates[Math.floor(Math.random() * candidates.length)] ?? MONSTERS[1]!;
    const playerUpgrade = save.upgrades[player.id] ?? 0;
    const playerProgress = getCharacterProgress(save.monsterXp[player.id] ?? 0);
    const enemyLevel = Math.max(1, playerProgress.level + (Math.random() > 0.72 ? 1 : 0));
    const enemyMax = enemy.stats.hp + save.level * 3 + enemyLevel * 2;
    const playerMax = player.stats.hp + playerUpgrade * 5 + playerProgress.level * 2;
    setAnswer("");
    setBattleEffect(null);
    setBattle({
      playerId: player.id, enemyId: enemy.id,
      playerLevel: playerProgress.level, enemyLevel,
      playerHp: playerMax, enemyHp: enemyMax,
      playerMaxHp: playerMax, enemyMaxHp: enemyMax,
      phase: "choose", question: null, category: null,
      timeLeft: save.difficulty === "hard" ? 15 : save.difficulty === "normal" ? 20 : 25,
      streak: 0, log: ["การต่อสู้เริ่มต้นแล้ว! เลือกหมวดโจทย์เพื่อออกท่า"],
    });
    setView("battle");
  }

  function chooseCategory(category: MathCategory) {
    if (!battle || battle.phase !== "choose") return;
    const question = createQuestion(category, save.difficulty);
    setAnswer("");
    setBattle({ ...battle, phase: "question", question, category, timeLeft: save.difficulty === "hard" ? 15 : save.difficulty === "normal" ? 20 : 25,
      log: ["โจทย์ใหม่ปรากฏขึ้น — ตอบให้ถูกเพื่อโจมตี!", ...battle.log].slice(0, 8) });
  }

  function resolveAnswer(raw: string) {
    if (!battle || battle.phase !== "question" || !battle.question) return;
    const player = getMonster(battle.playerId);
    const enemy = getMonster(battle.enemyId);
    const correct = isCorrectAnswer(battle.question, raw);
    if (correct) {
      const upgrade = save.upgrades[player.id] ?? 0;
      const speedBonus = save.timed ? Math.floor(battle.timeLeft / 5) : 0;
      const damage = Math.round((13 + player.stats.atk * 0.82 + upgrade * 1.5) * (1 + Math.min(battle.streak, 4) * 0.07) + speedBonus);
      const nextHp = Math.max(0, battle.enemyHp - damage);
      const nextStreak = battle.streak + 1;
      const effectId = Date.now();
      setBattleEffect({ id: effectId, kind: speedBonus >= 3 || battle.streak >= 2 ? "critical" : "hit", label: speedBonus >= 3 || battle.streak >= 2 ? "CRITICAL -" + damage : "-" + damage + " HP" });
      window.setTimeout(() => setBattleEffect((current) => current?.id === effectId ? null : current), 950);
      if (nextHp === 0) {
        setBattle({ ...battle, enemyHp: 0, phase: "won", question: null, streak: nextStreak,
          log: ["โจมตีสำเร็จ! " + enemy.name + " พ่ายแพ้แล้ว", "ตอบถูก! สร้างความเสียหาย " + damage, ...battle.log].slice(0, 8) });
        setSave((current) => {
          let xp = current.xp + 65;
          let level = current.level;
          while (xp >= level * 100) { xp -= level * 100; level += 1; }
          return {
            ...current,
            coins: current.coins + 120,
            xp,
            level,
            wins: current.wins + 1,
            monsterXp: { ...current.monsterXp, [player.id]: (current.monsterXp[player.id] ?? 0) + CHARACTER_XP_REWARDS.victory },
          };
        });
      } else {
        setBattle({ ...battle, enemyHp: nextHp, phase: "choose", question: null, streak: nextStreak,
          log: ["ตอบถูก! โจมตี " + enemy.name + " -" + damage + " HP", ...battle.log].slice(0, 8) });
      }
    } else {
      const effectId = Date.now();
      setBattleEffect({ id: effectId, kind: "miss", label: "MISS!" });
      window.setTimeout(() => setBattleEffect((current) => current?.id === effectId ? null : current), 950);
      const incoming = Math.max(7, Math.round(enemy.stats.atk * 0.72 - player.stats.def * 0.13));
      const nextHp = Math.max(0, battle.playerHp - incoming);
      if (nextHp === 0) {
        setBattle({ ...battle, playerHp: 0, phase: "lost", question: null, streak: 0,
          log: ["พลาดจังหวะ! " + enemy.name + " โจมตีกลับ -" + incoming + " HP", "การต่อสู้สิ้นสุดลง", ...battle.log].slice(0, 8) });
        setSave((current) => ({
          ...current,
          coins: current.coins + 25,
          xp: current.xp + 10,
          losses: current.losses + 1,
          monsterXp: { ...current.monsterXp, [player.id]: (current.monsterXp[player.id] ?? 0) + CHARACTER_XP_REWARDS.defeat },
        }));
      } else {
        setBattle({ ...battle, playerHp: nextHp, phase: "choose", question: null, streak: 0,
          log: [(raw.trim() ? "คำตอบยังไม่ถูกต้อง" : "หมดเวลา!"), enemy.name + " โจมตีกลับ -" + incoming + " HP", ...battle.log].slice(0, 8) });
      }
    }
    setAnswer("");
  }

  function performSummon(count: 1 | 10) {
    if (summonBusy) return;
    const cost = count === 1 ? SUMMON_COST.single : SUMMON_COST.ten;
    if (save.coins < cost) {
      setNotice("เหรียญไม่พอ — ลองชนะการต่อสู้เพื่อรับเหรียญเพิ่ม");
      return;
    }
    const result = summonBatch(save, count);
    if (!result) return;
    setSummonBusy(true);
    setSave(result.save);
    setSummonResults(result.results);
    window.setTimeout(() => setSummonBusy(false), 850);
    setNotice("");
  }

  function upgradeMonster(monster: Monster) {
    const level = save.upgrades[monster.id] ?? 0;
    const cost = upgradeCost(level);
    const amount = save.shards[monster.id] ?? 0;
    if (level >= 5 || amount < cost) return;
    setSave((current) => ({ ...current,
      shards: { ...current.shards, [monster.id]: (current.shards[monster.id] ?? 0) - cost },
      upgrades: { ...current.upgrades, [monster.id]: level + 1 },
    }));
    setNotice(monster.name + " อัปเกรดสำเร็จ!");
  }

  const detailMonster = selectedDetail ? getMonster(selectedDetail) : null;
  const detailProgress = detailMonster ? getCharacterProgress(save.monsterXp[detailMonster.id] ?? 0) : null;

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView("home")} aria-label="กลับหน้าแรก">
          <span className="brand-mark">N</span><span><strong>NUMORA</strong><small>RUNE CLASH</small></span>
        </button>
        <div className="topbar-right">
          <div className="wallet"><span>◈</span><strong>{save.coins.toLocaleString("en-US")}</strong><small>COINS</small></div>
          <div className="profile-chip"><span className="profile-avatar">✦</span><span><b>{playerName}</b><small>LV.{save.level}</small></span></div>
        </div>
      </header>

      <div className="page-layout">
        <aside className="sidebar">
          <div className="side-label">ADVENTURE</div>
          <NavButton active={view === "home"} icon="⌂" label="หน้าหลัก" onClick={() => setView("home")} />
          <NavButton active={view === "battle"} icon="⚔" label="ต่อสู้" onClick={() => setView("battle")} />
          <NavButton active={view === "summon"} icon="✧" label="ศาล召 / กาชา" onClick={() => setView("summon")} />
          <NavButton active={view === "collection"} icon="▦" label="มอนสเตอร์" onClick={() => setView("collection")} />
          <NavButton active={view === "online"} icon="◎" label="ออนไลน์ PvP" onClick={() => setView("online")} />
          <div className="side-divider" />
          <div className="side-label">SYSTEM</div>
          <NavButton active={view === "settings"} icon="⚙" label="ตั้งค่า" onClick={() => setView("settings")} />
          <div className="sidebar-bottom"><div className="season-mark">✦</div><span>THE RUNE SEASON</span><small>Chapter 01 · Awakening</small></div>
        </aside>

        <main className="main-content">
          {view === "home" && (
            <section className="view-stack">
              <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> OFFLINE DEMO · CHAPTER 01</div><h1>ยินดีต้อนรับสู่ <em>NUMORA</em></h1><p>ทุกคำตอบคือพลัง ทุกการต่อสู้คือการผจญภัย</p></div><div className="level-card"><small>ADVENTURER LEVEL</small><strong>LV. {save.level.toString().padStart(2, "0")}</strong><Bar value={save.xp} max={xpNeeded} tone="xp" /><small>{save.xp} / {xpNeeded} XP</small></div></div>

              <div className="hero-banner">
                <div className="hero-glow" /><div className="hero-copy"><div className="hero-kicker">✦ THE RUNE AWAKENS ✦</div><h2>พลังแห่งปัญญา<br /><span>เริ่มต้นที่นี่</span></h2><p>รวบรวมเหล่าผู้พิทักษ์ ฝึกฝนไหวพริบ และเขียนตำนานบทใหม่ด้วยคำตอบของคุณ</p><button className="btn btn-gold" onClick={startBattle}>เริ่มการผจญภัย <span>→</span></button></div>
                <div className="hero-rune rune-one">✦</div><div className="hero-rune rune-two">◇</div><div className="hero-mascot"><div className="mascot-ring" /><Sprite monster={getMonster("noctyra")} size={190} /></div>
                <div className="hero-caption"><span>01 / 06</span><span>THE NIGHTFALL GUARDIAN</span></div>
              </div>

              <div className="section-heading"><div><span className="eyebrow">YOUR JOURNEY</span><h2>เส้นทางนักผจญภัย</h2></div><span className="muted-note">บันทึกความคืบหน้าในเครื่องนี้</span></div>
              <div className="stats-grid">
                <Stat label="มอนสเตอร์ที่มี" value={ownedMonsters.length + " / " + MONSTERS.length} icon="♙" />
                <Stat label="ชนะการต่อสู้" value={save.wins} icon="⚔" />
                <Stat label="แพ้การต่อสู้" value={save.losses} icon="◇" />
                <Stat label="เหรียญสะสม" value={save.coins.toLocaleString("en-US")} icon="◈" />
              </div>

              <div className="section-heading"><div><span className="eyebrow">QUICK ACCESS</span><h2>ออกเดินทางต่อ</h2></div></div>
              <div className="shortcut-grid">
                <button className="shortcut-card battle-shortcut" onClick={startBattle}><span className="shortcut-icon">⚔</span><span><b>สนามประลอง</b><small>ตอบโจทย์เพื่อโจมตี</small></span><i>↗</i></button>
                <button className="shortcut-card summon-shortcut" onClick={() => { setView("summon"); setSummonResults([]); }}><span className="shortcut-icon">✧</span><span><b>Rune Summon</b><small>อัญเชิญผู้พิทักษ์ใหม่</small></span><i>↗</i></button>
                <button className="shortcut-card collection-shortcut" onClick={() => setView("collection")}><span className="shortcut-icon">▦</span><span><b>สมุดมอนสเตอร์</b><small>ดูทีมและอัปเกรด</small></span><i>↗</i></button>
              </div>
            </section>
          )}

          {view === "battle" && (
            <section className="view-stack">
              <PageTitle eyebrow="ARENA · SOLO MODE" title="สนามประลอง" subtitle="เลือกทักษะคณิตศาสตร์ แล้วเปลี่ยนคำตอบที่ถูกต้องให้เป็นพลังโจมตี" />
              {!battle ? (
                <div className="battle-start-panel">
                  <div className="start-illustration"><div className="start-orbit" /><Sprite monster={selected} size={160} /></div>
                  <div className="start-info"><span className="eyebrow">YOUR PARTNER</span><h2>{selected.name}</h2><p>{selected.epithet} · {ELEMENT_LABEL[selected.element]}</p><div className="mini-stats"><span>HP <b>{selected.stats.hp}</b></span><span>ATK <b>{selected.stats.atk}</b></span><span>DEF <b>{selected.stats.def}</b></span></div><button className="btn btn-gold" onClick={startBattle}>เข้าสู่สนามประลอง <span>→</span></button></div>
                  <div className="arena-notes"><b>กติกาการต่อสู้</b><p>เลือกหมวดโจทย์ → ตอบให้ถูก → สร้างความเสียหายแก่คู่ต่อสู้</p><p>ตอบผิดหรือหมดเวลา คู่ต่อสู้จะโจมตีกลับ</p><small>โหมดฝึกฝน · เล่นคนเดียวกับ AI</small></div>
                </div>
              ) : (
                <div className="battle-layout">
                  <div className="battle-main">
                    <div className="battle-topline"><span>ARENA 01 · MYSTIC GROVE</span><span className="round-badge">ROUND ACTIVE</span></div>
                    <div className="battlefield">
                      <div className="battle-stars">✦　　 ·　　✧　　　 ✦　　 ·</div>
                      <div className={"enemy-unit " + (battleEffect?.kind === "hit" || battleEffect?.kind === "critical" ? "unit-hit" : "")}>
                        <div className="unit-info enemy-info"><b>{getMonster(battle.enemyId).name}</b><small>WILD GUARDIAN · LV.{battle.enemyLevel}</small><Bar value={battle.enemyHp} max={battle.enemyMaxHp} /></div>
                        <Sprite key={"enemy-" + (battleEffect?.id ?? "idle")} monster={getMonster(battle.enemyId)} size={156} className={"sprite-float rarity-aura aura-" + getMonster(battle.enemyId).rarity + (battleEffect?.kind === "hit" || battleEffect?.kind === "critical" ? " sprite-hit" : "")} />
                      </div>
                      <div className={"player-unit " + (battleEffect?.kind === "miss" ? "unit-hit" : "")}>
                        <Sprite key={"player-" + (battleEffect?.id ?? "idle")} monster={getMonster(battle.playerId)} size={168} className={"sprite-float rarity-aura aura-" + getMonster(battle.playerId).rarity + (battleEffect?.kind === "miss" ? " sprite-hit" : "")} />
                        <div className="unit-info player-info"><b>{getMonster(battle.playerId).name}</b><small>YOUR GUARDIAN · LV.{battle.playerLevel}</small><Bar value={battle.playerHp} max={battle.playerMaxHp} /></div>
                      </div>
                      {battleEffect && <div key={battleEffect.id} className={"battle-fx fx-" + battleEffect.kind} aria-live="polite"><span className="fx-spark">✦</span><b>{battleEffect.label}</b><span className="fx-spark">✧</span></div>}
                      <div className="ground ground-left" /><div className="ground ground-right" />
                    </div>
                    <div className="battle-console">
                      {battle.phase === "choose" && <><div className="console-heading"><span className="console-diamond">◆</span><div><b>เลือกท่าโจมตี</b><small>SELECT YOUR MATH SKILL</small></div><span className="combo-pill">COMBO × {battle.streak}</span></div><div className="skill-grid">{categories.map((category) => <button key={category.id} className="skill-card" onClick={() => chooseCategory(category.id)}><strong>{category.glyph}</strong><span>{category.title}</span><small>{category.label}</small></button>)}</div></>}
                      {battle.phase === "question" && battle.question && <div className="question-panel"><div className="question-head"><span>{battle.category === "equation" ? "EQUATION CHALLENGE" : battle.category === "multiply" ? "MULTIPLICATION CHALLENGE" : "ARITHMETIC CHALLENGE"}</span>{save.timed ? <b className={battle.timeLeft <= 5 ? "timer danger" : "timer"}>◷ {battle.timeLeft}s</b> : <b className="timer">UNTIMED</b>}</div><div className="question-expression">{battle.question.prompt}</div><form className="answer-form" onSubmit={(event) => { event.preventDefault(); resolveAnswer(answer); }}><input autoFocus value={answer} onChange={(event) => setAnswer(event.target.value.slice(0, 8))} inputMode="numeric" placeholder="ใส่คำตอบ..." aria-label="คำตอบโจทย์คณิตศาสตร์" /><button className="btn btn-gold" disabled={!answer.trim()}>โจมตี <span>➤</span></button></form><small className="hint-line">✦ {battle.question.hint}</small></div>}
                      {(battle.phase === "won" || battle.phase === "lost") && <div className="battle-result"><div className="result-emblem">{battle.phase === "won" ? "✦" : "◇"}</div><span className="eyebrow">{battle.phase === "won" ? "VICTORY · +120 COINS · +65 XP" : "DEFEAT · +25 COINS · +10 XP"}</span><h2>{battle.phase === "won" ? "ชัยชนะเป็นของคุณ!" : "กลับไปฝึกฝนอีกครั้ง"}</h2><p>{battle.phase === "won" ? "คุณพิสูจน์พลังแห่งปัญญาได้สำเร็จ" : "ทุกความผิดพลาดคือบทเรียนของนักผจญภัย"}</p><button className="btn btn-gold" onClick={() => { setBattle(null); setView("home"); }}>กลับหน้าหลัก <span>→</span></button><button className="btn btn-ghost" onClick={() => { setBattle(null); startBattle(); }}>สู้อีกครั้ง</button></div>}
                    </div>
                  </div>
                  <aside className="battle-log"><div className="log-title"><b>บันทึกการต่อสู้</b><small>BATTLE LOG</small></div>{battle.log.map((line, index) => <p key={index} className={index === 0 ? "log-current" : ""}>› {line}</p>)}<div className="battle-log-tip">TIP: การตอบถูกต่อเนื่องจะเพิ่มคอมโบและความเสียหาย</div></aside>
                </div>
              )}
            </section>
          )}

          {view === "summon" && (
            <section className="view-stack">
              <PageTitle eyebrow="RUNE ALTAR · SUMMONING GATE" title="แท่นอัญเชิญ" subtitle="เรียกผู้พิทักษ์จากเศษเสี้ยวแห่งรูน — ใช้เหรียญที่ได้รับจากการเล่นเท่านั้น" />
              <div className={"summon-stage " + (summonBusy ? "is-summoning" : "")}>
                <div className="summon-stars">✦　·　✧　　　✦　　·　✦</div>
                <div className="summon-particle-cloud" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span><span>·</span><span>✧</span><span>✦</span><span>·</span><span>✧</span></div><div className="portal portal-back" /><div className="portal portal-front" /><div className="portal-core">N</div>
                <div className="summon-rune rune-a">◇</div><div className="summon-rune rune-b">✧</div><div className="summon-rune rune-c">✦</div>
                <div className="summon-stage-copy"><span className="eyebrow">THE ANCIENT RUNE ALTAR · 5 RARITIES</span><h2>โชคชะตา<br /><em>รอการปลุกตื่น</em></h2><p>ทุกการอัญเชิญคือโอกาสพบผู้พิทักษ์คนใหม่</p></div>
                <div className="summon-stage-foot"><span>ANCIENT GATE · 001</span><span>COMMON → MYTHIC · COIN ONLY</span></div>
              </div>
              <div className="summon-toolbar"><div><span className="eyebrow">YOUR WALLET</span><h3>◈ {save.coins.toLocaleString("en-US")} <small>COINS</small></h3></div><div className="pity-group"><div><small>EPIC+ GUARANTEE</small><b>{save.epicPity}/10</b><Bar value={save.epicPity} max={10} tone="xp" /></div><div><small>LEGENDARY+ GUARANTEE</small><b>{save.legendaryPity}/50</b><Bar value={save.legendaryPity} max={50} tone="xp" /></div><div><small>MYTHIC GUARANTEE</small><b>{save.mythicPity}/100</b><Bar value={save.mythicPity} max={100} tone="xp" /></div></div></div>
              <div className="summon-actions"><button className="btn btn-violet" disabled={summonBusy || save.coins < SUMMON_COST.single} onClick={() => performSummon(1)}><span>✧</span> อัญเชิญ 1 ครั้ง <small>◈ {SUMMON_COST.single}</small></button><button className="btn btn-gold" disabled={summonBusy || save.coins < SUMMON_COST.ten} onClick={() => performSummon(10)}><span>✦</span> อัญเชิญ 10 ครั้ง <small>◈ {SUMMON_COST.ten} · SAVE 100</small></button><button className="text-button" onClick={() => setShowRates(!showRates)}>{showRates ? "ซ่อนอัตราสุ่ม" : "ดูอัตราสุ่มและกติกาการันตี"}　⌄</button></div>
              {showRates && <div className="rates-panel"><div className="section-heading"><div><span className="eyebrow">TRANSPARENCY FIRST</span><h2>อัตราการอัญเชิญ</h2></div></div><div className="rate-list">{(["mythic", "legendary", "epic", "rare", "common"] as Rarity[]).map((rarity) => <div key={rarity} className="rate-row"><span className="rarity-dot" style={{ background: RARITY_COLOR[rarity] }} /><b>{rarityText(rarity)}</b><strong>{BASE_RATES[rarity]}%</strong></div>)}</div><p className="fine-print">อัตราด้านบนคืออัตราพื้นฐานก่อนใช้ระบบการันตี: Epic+ เมื่อสะสม 10 ครั้ง, Legendary+ เมื่อสะสม 50 ครั้ง และ Mythic เมื่อสะสม 100 ครั้งโดยไม่ได้ระดับนั้น ระบบจะรีเซ็ตตามผลที่ได้รับจริง</p></div>}
              {summonResults.length > 0 && <div className="summon-results"><div className="section-heading"><div><span className="eyebrow">NEW ARRIVALS</span><h2>ผลการอัญเชิญ</h2></div><button className="text-button" onClick={() => setSummonResults([])}>ล้างผลลัพธ์ ×</button></div><div className="results-grid">{summonResults.map((result, index) => <div className={"result-card rarity-" + result.monster.rarity} key={result.monster.id + "-" + index} style={{ animationDelay: Math.min(index, 9) * 90 + "ms" }}><div className="result-rarity">{result.guaranteed ? "✦ GUARANTEED" : rarityText(result.monster.rarity)}</div><Sprite monster={result.monster} size={88} /><b>{result.monster.name}</b><small>{result.monster.epithet}</small>{result.duplicate ? <span className="duplicate-tag">ซ้ำ +{result.shards} SHARDS</span> : <span className="new-tag">NEW GUARDIAN</span>}</div>)}</div></div>}
              <div className="summon-footnote">เหรียญได้รับจากชัยชนะและกิจกรรมภายในเกม · ไม่มีการซื้อด้วยเงินจริง · ตัวซ้ำจะเปลี่ยนเป็น Shards โดยอัตโนมัติ</div>
            </section>
          )}

          {view === "collection" && (
            <section className="view-stack">
              <PageTitle eyebrow="GUARDIAN ARCHIVE · COLLECTION" title="สมุดผู้พิทักษ์" subtitle="เหล่ามอนสเตอร์ที่คุณได้พบเจอ อัปเกรด และร่วมเดินทาง" />
              <div className="collection-summary"><div><strong>{ownedMonsters.length}</strong><span>OWNED GUARDIANS</span></div><div><strong>{MONSTERS.length - ownedMonsters.length}</strong><span>UNDISCOVERED</span></div><div><strong>{Object.values(save.shards).reduce((a, b) => a + b, 0)}</strong><span>TOTAL SHARDS</span></div></div>
              <div className="collection-filters"><div><span>RARITY</span><select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value as "all" | Rarity)}><option value="all">ทุกระดับ</option><option value="common">Common</option><option value="rare">Rare</option><option value="epic">Epic</option><option value="legendary">Legendary</option><option value="mythic">Mythic</option></select></div><div><span>ELEMENT</span><select value={filterElement} onChange={(e) => setFilterElement(e.target.value)}><option value="all">ทุกธาตุ</option>{Object.entries(ELEMENT_LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div><button className="btn btn-ghost btn-small" onClick={() => { setFilterRarity("all"); setFilterElement("all"); }}>รีเซ็ตตัวกรอง</button></div>
              <div className="monster-grid">{displayedMonsters.map((monster) => { const upgradeLevel = save.upgrades[monster.id] ?? 0; const character = getCharacterProgress(save.monsterXp[monster.id] ?? 0); const shardCount = save.shards[monster.id] ?? 0; const cost = upgradeCost(upgradeLevel); return <article className={"monster-card rarity-" + monster.rarity} key={monster.id} onClick={() => setSelectedDetail(monster.id)} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") setSelectedDetail(monster.id); }}><div className="monster-card-top"><span className="rarity-label">{rarityText(monster.rarity)}</span><span className="element-label">{ELEMENT_LABEL[monster.element]}</span></div><div className="monster-art"><div className="art-glow" /><Sprite monster={monster} size={118} className={"rarity-aura aura-" + monster.rarity} /></div><div className="monster-card-info"><h3>{monster.name}</h3><p>{monster.epithet}</p><div className="monster-card-meta"><span>ATK {monster.stats.atk + upgradeLevel * 2 + Math.floor(character.level / 5)}</span><span>LV.{character.level}</span></div><div className="character-xp-track"><i style={{ width: character.progress + "%" }} /></div><div className="shard-line">✧ {shardCount} / {upgradeLevel >= 5 ? "MAX" : cost} SHARDS · UPGRADE {upgradeLevel}/5</div></div></article>; })}</div>
              {displayedMonsters.length === 0 && <div className="empty-state"><span>◇</span><b>ยังไม่มีผู้พิทักษ์ในหมวดนี้</b><p>ลองเปลี่ยนตัวกรองหรือไปที่แท่นอัญเชิญ</p><button className="btn btn-violet" onClick={() => setView("summon")}>ไปอัญเชิญ <span>→</span></button></div>}
            </section>
          )}

          {view === "online" && (
            <section className="view-stack">
              <PageTitle eyebrow="RUNE NETWORK · MULTIPLAYER" title="สนามประลองออนไลน์" subtitle="ท้าดวลเพื่อน แข่งขันตอบโจทย์เดียวกันเพื่อแย่งสิทธิ์โจมตีก่อน" />
              <div className="online-status"><span className="status-indicator" /><div><b>REALTIME SERVER NOT CONNECTED</b><small>ระบบห้องและ PvP จะแสดงสถานะพร้อมใช้งานเมื่อเชื่อมต่อ backend</small></div><span className="status-pill">OFFLINE</span></div>
              <div className="online-grid"><div className="online-card"><div className="online-icon">⌘</div><span className="eyebrow">CREATE NEW ROOM</span><h2>สร้างห้องประลอง</h2><p>สร้างรหัสห้องส่วนตัว แล้วชวนเพื่อนเข้ามาประลองคณิตศาสตร์</p><label>ชื่อนักผจญภัย</label><input value={playerName} onChange={(e) => setPlayerName(e.target.value.slice(0, 18))} /><button className="btn btn-violet" disabled>ต้องเชื่อมต่อ Realtime ก่อน</button></div><div className="online-card"><div className="online-icon">⌕</div><span className="eyebrow">JOIN A ROOM</span><h2>เข้าร่วมห้อง</h2><p>กรอกรหัสห้อง 5 ตัวอักษรจากเพื่อนของคุณ</p><label>รหัสห้อง</label><input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5))} placeholder="เช่น A7K2P" /><button className="btn btn-gold" disabled>ต้องเชื่อมต่อ Realtime ก่อน</button></div></div>
              <div className="online-explainer"><b>รูปแบบการต่อสู้ PvP ที่วางไว้</b><div className="online-steps"><span><i>01</i>ผู้เล่นทั้งสองเข้าห้องและกดพร้อม</span><span><i>02</i>เซิร์ฟเวอร์ส่งโจทย์ชุดเดียวกัน</span><span><i>03</i>ผู้ตอบถูกก่อนรับสิทธิ์โจมตี</span><span><i>04</i>ตรวจคำตอบบนเซิร์ฟเวอร์ ป้องกันการโกง</span></div><small>ต้องเพิ่มฐานข้อมูลห้อง, ระบบ Realtime, matchmaking และ server-side answer validation ก่อนเปิด PvP จริง</small></div>
            </section>
          )}

          {view === "settings" && (
            <section className="view-stack">
              <PageTitle eyebrow="SYSTEM CONFIGURATION" title="ตั้งค่าเกม" subtitle="ปรับการเล่นให้เหมาะกับสไตล์ของคุณ" />
              <div className="settings-panel"><div className="settings-row"><div><b>เสียงประกอบ</b><small>เปิดหรือปิดเสียงเอฟเฟกต์ในเกม</small></div><button className={"toggle " + (save.sound ? "on" : "")} onClick={() => setSave({ ...save, sound: !save.sound })}><span /></button></div><div className="settings-row"><div><b>จับเวลาโจทย์</b><small>ปิดได้เพื่อฝึกฝนโดยไม่จำกัดเวลา</small></div><button className={"toggle " + (save.timed ? "on" : "")} onClick={() => setSave({ ...save, timed: !save.timed })}><span /></button></div><div className="settings-row"><div><b>ระดับความยาก</b><small>กำหนดช่วงตัวเลขและความซับซ้อนของโจทย์</small></div><select value={save.difficulty} onChange={(e) => setSave({ ...save, difficulty: e.target.value as SaveData["difficulty"] })}><option value="easy">เริ่มต้น</option><option value="normal">ปานกลาง</option><option value="hard">ท้าทาย</option></select></div><div className="settings-row"><div><b>คู่หูหลัก</b><small>มอนสเตอร์ที่ใช้เริ่มการต่อสู้</small></div><select value={save.selected} onChange={(e) => setSave({ ...save, selected: e.target.value })}>{ownedMonsters.map((monster) => <option key={monster.id} value={monster.id}>{monster.name}</option>)}</select></div></div>
              <div className="save-note"><span>◈</span><div><b>ข้อมูลเกมบันทึกในอุปกรณ์นี้</b><small>ความคืบหน้า เหรียญ มอนสเตอร์ และประวัติกาชาจะอยู่ใน Local Storage ของเบราว์เซอร์นี้</small></div></div>
              <button className="btn btn-ghost danger-btn" onClick={() => { if (window.confirm("ต้องการรีเซ็ตข้อมูลเกมทั้งหมดหรือไม่?")) { window.localStorage.removeItem("numora-save-v1"); setSave(loadSave()); setBattle(null); setView("home"); } }}>รีเซ็ตข้อมูลเกม</button>
            </section>
          )}
        </main>
      </div>

      {notice && <div className="toast" role="status"><span>✦</span>{notice}<button onClick={() => setNotice("")}>×</button></div>}

      {detailMonster && (
        <div className="modal-backdrop" onClick={() => setSelectedDetail(null)}>
          <div className={"monster-modal rarity-" + detailMonster.rarity} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDetail(null)}>×</button>
            <div className="modal-art"><div className="art-glow" /><Sprite monster={detailMonster} size={174} className={"rarity-aura aura-" + detailMonster.rarity} /></div>
            <div className="modal-copy"><span className="rarity-label">{rarityText(detailMonster.rarity)} · {ELEMENT_LABEL[detailMonster.element]}</span><h2>{detailMonster.name}</h2><p className="modal-epithet">{detailMonster.epithet}</p><p>{detailMonster.lore}</p><div className="character-level-panel"><div><small>CHARACTER LEVEL</small><b>LV. {detailProgress?.level ?? 1}{detailProgress?.maxed ? " · MAX" : ""}</b></div><div className="character-level-bar"><i style={{ width: (detailProgress?.progress ?? 0) + "%" }} /></div><small>{detailProgress?.maxed ? "ถึงระดับสูงสุดแล้ว" : (detailProgress?.xp ?? 0) + " / " + (detailProgress?.nextXp ?? 100) + " XP · รับจากการต่อสู้"}</small></div><div className="modal-stats"><span>HP <b>{detailMonster.stats.hp + (save.upgrades[detailMonster.id] ?? 0) * 5}</b></span><span>ATK <b>{detailMonster.stats.atk + (save.upgrades[detailMonster.id] ?? 0) * 2 + Math.floor((detailProgress?.level ?? 1) / 5)}</b></span><span>DEF <b>{detailMonster.stats.def}</b></span></div><div className="skill-description"><small>PASSIVE SKILL</small><b>{detailMonster.skill}</b></div><div className="upgrade-box"><div><small>CHARACTER SHARDS</small><b>✧ {save.shards[detailMonster.id] ?? 0} / {upgradeCost(save.upgrades[detailMonster.id] ?? 0)}</b></div><button className="btn btn-violet btn-small" disabled={(save.upgrades[detailMonster.id] ?? 0) >= 5 || (save.shards[detailMonster.id] ?? 0) < upgradeCost(save.upgrades[detailMonster.id] ?? 0)} onClick={() => upgradeMonster(detailMonster)}>อัปเกรด · {upgradeCost(save.upgrades[detailMonster.id] ?? 0)} Shards</button></div><div className="modal-actions"><button className="btn btn-gold" onClick={() => { setSave({ ...save, selected: detailMonster.id }); setSelectedDetail(null); setNotice("เลือก " + detailMonster.name + " เป็นคู่หูหลักแล้ว"); }}>เลือกเป็นคู่หู</button><button className="btn btn-ghost" onClick={() => setSelectedDetail(null)}>ปิด</button></div></div>
          </div>
        </div>
      )}
      <footer className="footer"><span>NUMORA © 2026</span><span>THINK FAST · BATTLE SMART · DISCOVER MORE</span><span>BUILD 0.1.0</span></footer>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return <button className={"nav-button " + (active ? "active" : "")} onClick={onClick}><span>{icon}</span>{label}{active && <i />}</button>;
}
function PageTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>;
}

export default App;