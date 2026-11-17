export type Rarity = "common" | "rare" | "epic" | "legendary";
export type Element = "Nature" | "Flame" | "Aqua" | "Volt" | "Shadow" | "Light" | "Metal" | "Arcane";
export type Shape = "slime" | "wolf" | "dragon" | "bird" | "knight" | "mage" | "beast" | "phantom" | "golem";

export interface Monster {
  id: string;
  name: string;
  epithet: string;
  rarity: Rarity;
  element: Element;
  shape: Shape;
  colors: { body: string; shade: string; light: string; accent: string };
  stats: { hp: number; atk: number; def: number };
  skill: string;
  lore: string;
}

const c = (body: string, shade: string, light: string, accent: string) => ({ body, shade, light, accent });

export const MONSTERS: Monster[] = [
  { id: "mossbit", name: "มอสบิต", epithet: "เจ้าป่าเขียว", rarity: "common", element: "Nature", shape: "slime", colors: c("#78c86b", "#326c51", "#c3ee9a", "#f7d77b"), stats: { hp: 112, atk: 16, def: 13 }, skill: "รากฟื้นฟู — เพิ่มพลังชีวิตหลังชนะ", lore: "สิ่งมีชีวิตตัวจิ๋วที่ถือกำเนิดจากหยดน้ำค้างในป่าลึก" },
  { id: "embercub", name: "เอมเบอร์คับ", epithet: "เขี้ยวเพลิง", rarity: "common", element: "Flame", shape: "wolf", colors: c("#ee854b", "#913e45", "#ffd18a", "#ffe277"), stats: { hp: 94, atk: 19, def: 10 }, skill: "ประกายไฟ — เพิ่มความเสียหายเล็กน้อย", lore: "ลูกหมาป่าที่สะสมประกายไฟไว้ตรงปลายหาง" },
  { id: "bubblit", name: "บับบลิต", epithet: "หยดธารา", rarity: "common", element: "Aqua", shape: "slime", colors: c("#5cbde3", "#28638f", "#b5f1ff", "#ffffff"), stats: { hp: 120, atk: 14, def: 15 }, skill: "ฟองป้องกัน — ลดความเสียหายที่ได้รับ", lore: "ก้อนน้ำมีชีวิตที่ชอบสะท้อนแสงดาวบนผิวน้ำ" },
  { id: "thornfox", name: "ธอร์นฟ็อกซ์", epithet: "จิ้งจอกหนาม", rarity: "common", element: "Nature", shape: "beast", colors: c("#a2a94f", "#515b35", "#d8dc8a", "#e6a75f"), stats: { hp: 103, atk: 17, def: 13 }, skill: "หนามสวนกลับ — มีโอกาสสะท้อนพลัง", lore: "ผู้พิทักษ์พุ่มไม้ที่รวดเร็วและไม่ชอบให้ใครรบกวน" },
  { id: "voltfin", name: "โวลต์ฟิน", epithet: "ปลากระแสฟ้า", rarity: "common", element: "Volt", shape: "bird", colors: c("#e9c84f", "#8d7130", "#fff3a0", "#71d8ff"), stats: { hp: 90, atk: 20, def: 10 }, skill: "ชาร์จไฟ — โจมตีแรงขึ้นเมื่อทำคอมโบ", lore: "ปลาบินจากทะเลเมฆที่ว่ายผ่านสายฟ้าได้อย่างอิสระ" },
  { id: "duskling", name: "ดัสคลิง", epithet: "ภูตสนธยา", rarity: "rare", element: "Shadow", shape: "phantom", colors: c("#8764bd", "#44315f", "#c7a5f2", "#67e1db"), stats: { hp: 100, atk: 23, def: 13 }, skill: "ม่านหมอก — ลดพลังโจมตีคู่ต่อสู้", lore: "ภูตตัวเล็กที่เฝ้าประตูระหว่างแสงสุดท้ายกับราตรี" },
  { id: "frostlynx", name: "ฟรอสต์ลิงซ์", epithet: "แมวหิมะ", rarity: "rare", element: "Aqua", shape: "wolf", colors: c("#91cee8", "#456a91", "#e2fbff", "#b5a8ff"), stats: { hp: 110, atk: 21, def: 15 }, skill: "เกล็ดน้ำแข็ง — เพิ่มเกราะเล็กน้อย", lore: "แมวหิมะผู้เดินทางผ่านยอดเขาที่ไม่มีวันละลาย" },
  { id: "ironjaw", name: "ไอรอนจอว์", epithet: "เขี้ยวเหล็ก", rarity: "rare", element: "Metal", shape: "golem", colors: c("#8e9cae", "#485568", "#dbe5ef", "#f0b65d"), stats: { hp: 132, atk: 20, def: 19 }, skill: "เกราะเสริม — รับความเสียหายน้อยลง", lore: "นักรบเหล็กที่ตื่นขึ้นเมื่อได้ยินเสียงค้อนจากเหมืองเก่า" },
  { id: "lunamoth", name: "ลูนามอธ", epithet: "ผีเสื้อจันทรา", rarity: "rare", element: "Light", shape: "bird", colors: c("#b4a2ea", "#5d4a91", "#f1e6ff", "#f5d47b"), stats: { hp: 106, atk: 22, def: 14 }, skill: "แสงจันทร์ — เพิ่มโบนัสเมื่อแก้โจทย์เร็ว", lore: "ผีเสื้อแห่งแสงจันทร์ที่ทิ้งละอองดาวไว้ทุกที่" },
  { id: "cinderhorn", name: "ซินเดอร์ฮอร์น", epithet: "แรดภูเขาไฟ", rarity: "rare", element: "Flame", shape: "beast", colors: c("#d76b4e", "#743a42", "#ffb17d", "#ffe08a"), stats: { hp: 125, atk: 23, def: 16 }, skill: "พุ่งชน — เพิ่มพลังโจมตีครั้งแรก", lore: "สัตว์เขาภูเขาไฟที่เดินผ่านลาวาได้ราวกับพื้นหญ้า" },
  { id: "aetherowl", name: "อีเธอร์อาวล์", epithet: "ผู้รู้แห่งฟ้า", rarity: "epic", element: "Arcane", shape: "bird", colors: c("#8c83d8", "#474276", "#ded9ff", "#79e7ef"), stats: { hp: 122, atk: 27, def: 18 }, skill: "ปัญญาดารา — เพิ่มคะแนนโจทย์สมการ", lore: "นกฮูกโบราณที่บันทึกสูตรคณิตศาสตร์ไว้บนปีก" },
  { id: "neonronin", name: "นีออนโรนิน", epithet: "ดาบสายฟ้า", rarity: "epic", element: "Volt", shape: "knight", colors: c("#4bbdc3", "#24556c", "#c3ffff", "#f3de75"), stats: { hp: 116, atk: 31, def: 16 }, skill: "คมดาบประจุ — คอมโบเพิ่มความเสียหาย", lore: "นักดาบไร้นามที่หลอมคมดาบจากสายฟ้าสีคราม" },
  { id: "abyssal", name: "อะบิสซัล", epithet: "ผู้กลืนแสง", rarity: "epic", element: "Shadow", shape: "dragon", colors: c("#7652a8", "#342447", "#b99be8", "#fa79c6"), stats: { hp: 130, atk: 29, def: 19 }, skill: "แรงดึงดูด — เจาะเกราะคู่ต่อสู้", lore: "มังกรจากรอยแยกใต้พิภพที่กลืนกินแสงดาวเป็นอาหาร" },
  { id: "solstice", name: "โซลสทิซ", epithet: "ผู้พิทักษ์อรุณ", rarity: "epic", element: "Light", shape: "knight", colors: c("#e4b85a", "#79512d", "#fff0ad", "#fff9e8"), stats: { hp: 128, atk: 28, def: 21 }, skill: "โล่รุ่งอรุณ — ฟื้นพลังเล็กน้อยเมื่อชนะ", lore: "อัศวินทองคำผู้ยืนเฝ้าประตูดวงอาทิตย์" },
  { id: "noctyra", name: "น็อกไทรา", epithet: "ราชินีรัตติกาล", rarity: "legendary", element: "Shadow", shape: "dragon", colors: c("#8c5baf", "#362347", "#e0b7f9", "#ff79bc"), stats: { hp: 148, atk: 36, def: 23 }, skill: "รัตติกาลนิรันดร์ — เพิ่มพลังโจมตีและเกราะ", lore: "มังกรผู้ครองท้องฟ้ายามค่ำคืนและดวงจันทร์สีเลือด" },
  { id: "aurion", name: "ออเรียน", epithet: "สิงห์สุริยะ", rarity: "legendary", element: "Light", shape: "beast", colors: c("#efbd55", "#8e542e", "#fff3b0", "#ffffff"), stats: { hp: 145, atk: 38, def: 22 }, skill: "สุริยะคำราม — โบนัสโจมตีสูงเมื่อแก้ถูก", lore: "สิงห์แห่งสุริยะที่ปรากฏเฉพาะวันที่ฟ้าสว่างที่สุด" },
  { id: "zerodrake", name: "ซีโร่เดรก", epithet: "มังกรศูนย์สูญ", rarity: "legendary", element: "Arcane", shape: "dragon", colors: c("#58b8b0", "#244b63", "#c7fff1", "#b38bff"), stats: { hp: 152, atk: 37, def: 25 }, skill: "อัลกอริทึมโบราณ — ลดความเสียหายและโจมตีแรง", lore: "มังกรกลไกที่ถือกำเนิดจากสมการแรกของจักรวาล" },
  { id: "celestia", name: "เซเลสเทีย", epithet: "ผู้ถักทอดวงดาว", rarity: "legendary", element: "Arcane", shape: "mage", colors: c("#9c8be9", "#51427e", "#f0e7ff", "#77edeb"), stats: { hp: 140, atk: 39, def: 21 }, skill: "ดาราพยากรณ์ — เพิ่มเวลาแก้โจทย์เล็กน้อย", lore: "จอมเวทผู้มองเห็นคำตอบของดวงดาวก่อนคำถามจะเกิดขึ้น" },
];

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "COMMON", rare: "RARE", epic: "EPIC", legendary: "LEGENDARY",
};
export const RARITY_COLOR: Record<Rarity, string> = {
  common: "#a8b2c7", rare: "#57b7e8", epic: "#bd8cff", legendary: "#ffc86a",
};
export const ELEMENT_LABEL: Record<Element, string> = {
  Nature: "พฤกษา", Flame: "เพลิง", Aqua: "วารี", Volt: "สายฟ้า",
  Shadow: "เงา", Light: "แสง", Metal: "โลหะ", Arcane: "อาคม",
};

export const getMonster = (id: string): Monster => MONSTERS.find((m) => m.id === id) ?? MONSTERS[0]!;
export const monstersByRarity = (rarity: Rarity) => MONSTERS.filter((m) => m.rarity === rarity);