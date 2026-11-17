export type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";
export type Element = "Nature" | "Flame" | "Aqua" | "Volt" | "Shadow" | "Light" | "Metal" | "Arcane";
export type Shape = "slime" | "wolf" | "dragon" | "bird" | "knight" | "mage" | "beast" | "phantom" | "golem" | "fox" | "serpent" | "fairy" | "reaper" | "mech" | "turtle" | "crystal" | "beetle" | "deer" | "manta" | "samurai" | "wisp" | "phoenix" | "hydra" | "clockwork" | "angel";

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
  { id: "pyroko", name: "ไพโรโกะ", epithet: "จิ้งจอกประกายดาว", rarity: "common", element: "Flame", shape: "fox", colors: c("#f08b4f", "#753b45", "#ffd39a", "#fff07c"), stats: { hp: 102, atk: 18, def: 12 }, skill: "หางประกาย — เพิ่มพลังโจมตีหลังตอบถูก", lore: "จิ้งจอกตัวน้อยที่สะสมประกายดาวไว้ในหางทั้งสาม" },
  { id: "coilune", name: "คอยลูน", epithet: "อสรพิษจันทรา", rarity: "rare", element: "Aqua", shape: "serpent", colors: c("#55b8b4", "#275d66", "#b1f4e6", "#d9bbff"), stats: { hp: 118, atk: 22, def: 17 }, skill: "เกล็ดจันทร์ — ลดความเสียหายจากการสวนกลับ", lore: "อสรพิษที่เลื้อยผ่านสายน้ำใต้แสงจันทร์โดยไร้เสียง" },
  { id: "pollenix", name: "พอลเลนิกซ์", epithet: "ภูตบุปผา", rarity: "rare", element: "Nature", shape: "fairy", colors: c("#d28bb7", "#75466f", "#ffe0f0", "#a9e88e"), stats: { hp: 108, atk: 23, def: 15 }, skill: "ละอองฟื้นฟู — เพิ่มพลังชีวิตเล็กน้อยเมื่อชนะ", lore: "ภูตตัวจิ๋วที่ปลุกดอกไม้ให้บานด้วยเสียงกระดิ่ง" },
  { id: "runephant", name: "รูนแฟนต์", epithet: "ผลึกผู้พิทักษ์", rarity: "epic", element: "Arcane", shape: "crystal", colors: c("#8a83dc", "#423b7c", "#e0ddff", "#6fe4df"), stats: { hp: 136, atk: 30, def: 20 }, skill: "ผลึกสะท้อน — เพิ่มพลังป้องกันตามคอมโบ", lore: "ผลึกมีชีวิตที่จดจำแสงจากอารยธรรมซึ่งสาบสูญ" },
  { id: "grimvolt", name: "กริมโวลต์", epithet: "อัศวินจักรกล", rarity: "epic", element: "Volt", shape: "mech", colors: c("#5b9db8", "#294b68", "#bcecff", "#ffe07b"), stats: { hp: 132, atk: 32, def: 20 }, skill: "โอเวอร์ชาร์จ — เพิ่มความเสียหายเมื่อคอมโบต่อเนื่อง", lore: "หุ่นพิทักษ์ที่ตื่นขึ้นเมื่อรูนสายฟ้ากลับมาทำงาน" },
  { id: "eclipsewyrm", name: "อีคลิปส์เวิร์ม", epithet: "มังกรคราสทมิฬ", rarity: "legendary", element: "Shadow", shape: "reaper", colors: c("#8460b7", "#332541", "#d7b9ff", "#ff8ebf"), stats: { hp: 150, atk: 38, def: 24 }, skill: "คราสนิรันดร์ — ได้รับเกราะเริ่มต้นและโบนัสคอมโบ", lore: "มังกรผู้เฝ้าคราสที่เชื่อมโลกแห่งแสงและเงาเข้าด้วยกัน" },
  { id: "craggle", name: "แครกเกิล", epithet: "ด้วงศิลาผู้พิทักษ์", rarity: "common", element: "Metal", shape: "beetle", colors: c("#9b9a78", "#4f564a", "#e2dba2", "#7dd4a1"), stats: { hp: 118, atk: 17, def: 16 }, skill: "เกราะหินผา — ลดความเสียหายที่ได้รับเล็กน้อย", lore: "ด้วงตัวจิ๋วที่สะสมแร่หายากไว้บนกระดอง" },
  { id: "silvarant", name: "ซิลวาแรนต์", epithet: "กวางแห่งแสงเหนือ", rarity: "rare", element: "Light", shape: "deer", colors: c("#b6c8c4", "#526f73", "#f1fff1", "#a8d8ff"), stats: { hp: 116, atk: 24, def: 16 }, skill: "เขาออโรรา — เพิ่มพลังโจมตีเมื่อคอมโบต่อเนื่อง", lore: "กวางสง่างามที่วิ่งผ่านม่านแสงเหนือและทิ้งประกายไว้บนหิมะ" },
  { id: "cloudray", name: "คลาวด์เรย์", epithet: "กระเบนเวหา", rarity: "rare", element: "Aqua", shape: "manta", colors: c("#559fbd", "#31516d", "#c2f2ff", "#e8cbff"), stats: { hp: 112, atk: 23, def: 17 }, skill: "กระแสเมฆ — เพิ่มโอกาสรับโบนัสเวลา", lore: "กระเบนแห่งทะเลเมฆที่โบยบินเหนือเกาะลอยฟ้า" },
  { id: "tempestronin", name: "เทมเพสต์โรนิน", epithet: "ซามูไรพายุ", rarity: "epic", element: "Volt", shape: "samurai", colors: c("#4f9cae", "#253f60", "#c4f4ef", "#f3d36f"), stats: { hp: 128, atk: 33, def: 19 }, skill: "คมดาบวายุ — เพิ่มความเสียหายเมื่อทำคอมโบ", lore: "นักรบผู้ฝึกฝนดาบใต้พายุสายฟ้ามานับพันปี" },
  { id: "auralis", name: "ออราลิส", epithet: "วิญญาณแห่งรุ่งอรุณ", rarity: "epic", element: "Light", shape: "wisp", colors: c("#d5a7e9", "#684d91", "#fff0ff", "#82e6da"), stats: { hp: 124, atk: 31, def: 21 }, skill: "ประกายอรุณ — ฟื้นพลังเล็กน้อยหลังตอบถูก", lore: "ดวงวิญญาณแห่งแสงแรกที่ชี้นำผู้เดินทางในคืนมืด" },
  { id: "solflare", name: "โซลแฟลร์", epithet: "ฟีนิกซ์สุริยัน", rarity: "legendary", element: "Flame", shape: "phoenix", colors: c("#e97845", "#813b48", "#ffe5a0", "#fff27c"), stats: { hp: 151, atk: 39, def: 23 }, skill: "คืนชีพจากเถ้าถ่าน — ได้รับพลังโจมตีเพิ่มเมื่อ HP ต่ำ", lore: "ฟีนิกซ์ผู้กางปีกเหนือดวงอาทิตย์และเกิดใหม่จากเปลวเพลิง" },
  { id: "nightmaw", name: "ไนต์มอว์", epithet: "ไฮดราแห่งรัตติกาล", rarity: "legendary", element: "Shadow", shape: "hydra", colors: c("#76529b", "#302442", "#d8b9ee", "#ff86bb"), stats: { hp: 158, atk: 38, def: 26 }, skill: "สามเศียรนิรันดร์ — ได้รับเกราะเพิ่มเมื่อเริ่มการต่อสู้", lore: "อสูรสามเศียรที่เฝ้าประตูสู่ห้วงมิติที่ไม่มีแสง" },
  { id: "chronarch", name: "โครนาร์ค", epithet: "ผู้คุมกาลเวลา", rarity: "mythic", element: "Arcane", shape: "clockwork", colors: c("#c39b5c", "#604653", "#fff0b7", "#81e2e7"), stats: { hp: 166, atk: 43, def: 29 }, skill: "หยุดห้วงเวลา — เพิ่มเวลาตอบโจทย์และพลังป้องกัน", lore: "ผู้พิทักษ์จักรวาลที่เก็บวินาทีสุดท้ายของดวงดาวไว้ในแกนกลไก" },
  { id: "seraphyne", name: "เซราฟีน", epithet: "เทวทูตแห่งดวงดาว", rarity: "mythic", element: "Light", shape: "angel", colors: c("#d6c4f5", "#67518c", "#ffffff", "#f7d77d"), stats: { hp: 162, atk: 45, def: 27 }, skill: "ดาวตกพิพากษา — เพิ่มโบนัสความเสียหายจากคำตอบที่ถูกต้อง", lore: "ผู้พิทักษ์แห่งหมู่ดาวที่ปรากฏเพียงครั้งเดียวในรอบพันปี" },
];
 
export const RARITY_LABEL: Record<Rarity, string> = {
  common: "COMMON", rare: "RARE", epic: "EPIC", legendary: "LEGENDARY",
};
export const RARITY_COLOR: Record<Rarity, string> = {
  common: "#a8b2c7", rare: "#57b7e8", epic: "#bd8cff", legendary: "#ffc86a", mythic: "#ff79d1",
};
export const ELEMENT_LABEL: Record<Element, string> = {
  Nature: "พฤกษา", Flame: "เพลิง", Aqua: "วารี", Volt: "สายฟ้า",
  Shadow: "เงา", Light: "แสง", Metal: "โลหะ", Arcane: "อาคม",
};

export const getMonster = (id: string): Monster => MONSTERS.find((m) => m.id === id) ?? MONSTERS[0]!;
export const monstersByRarity = (rarity: Rarity) => MONSTERS.filter((m) => m.rarity === rarity);