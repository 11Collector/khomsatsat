"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react"; 
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Check, RefreshCcw, Quote, Download, Loader2, Heart } from "lucide-react";
import { Kanit } from "next/font/google";
import { toPng } from 'html-to-image'; 

const kanit = Kanit({ 
  subsets: ["thai", "latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"] 
});

// --- 1. DATA: Mood Check (10 อารมณ์) ---
const moodOptions = [
  { id: "happy", icon: "😊", title: "มีความสุข", theme: "border-yellow-400 bg-yellow-50 text-yellow-600" },
  { id: "sad", icon: "😢", title: "เศร้าหมอง", theme: "border-blue-400 bg-blue-50 text-blue-600" },
  { id: "angry", icon: "😡", title: "โกรธมาก", theme: "border-red-500 bg-red-50 text-red-600" },
  { id: "fear", icon: "😨", title: "หวาดกลัว", theme: "border-purple-500 bg-purple-50 text-purple-600" },
  { id: "love", icon: "❤️", title: "คลั่งรัก", theme: "border-pink-500 bg-pink-50 text-pink-600" },
  { id: "lonely", icon: "🍂", title: "โดดเดี่ยว", theme: "border-stone-500 bg-stone-50 text-stone-600" },
  { id: "hope", icon: "✨", title: "เปี่ยมหวัง", theme: "border-emerald-400 bg-emerald-50 text-emerald-600" },
  { id: "confused", icon: "🌀", title: "สับสน", theme: "border-indigo-400 bg-indigo-50 text-indigo-600" },
  { id: "apathetic", icon: "😐", title: "เฉยเมย", theme: "border-slate-400 bg-slate-50 text-slate-500" },
  { id: "exhausted", icon: "🫠", title: "เหนื่อยล้า", theme: "border-orange-400 bg-orange-50 text-orange-600" }
];

// --- 2. DATA: คำนามธรรม (30 คำต่อหมวด) ---
const abstractWords = {
  happy: [
    "รอยยิ้ม", "เสียงหัวเราะ", "เบิกบาน", "อบอุ่น", "แสงแดด", "ดอกไม้", "โบยบิน", "เปล่งประกาย", "สมหวัง", "หอมหวาน", 
    "สว่างไสว", "สบายใจ", "ร่าเริง", "ของขวัญ", "ท้องฟ้า", "ปลอดโปร่ง", "รื่นรมย์", "ยินดี", "มหัศจรรย์", "ชื่นใจ", 
    "เติมเต็ม", "โอบกอด", "วันใหม่", "ฤดูใบไม้ผลิ", "เสียงเพลง", "เต้นรำ", "อิสระ", "งดงาม", "สดใส", "ลงตัว"
  ],
  sad: [
    "น้ำตา", "ร่วงหล่น", "มืดมน", "แตกสลาย", "บาดแผล", "เงียบงัน", "ความทรงจำ", "สูญเสีย", "รอยร้าว", "เปราะบาง", 
    "ฤดูหนาว", "ฝนพรำ", "จางหาย", "ว่างเปล่า", "ร้องไห้", "ทรมาน", "เจ็บปวด", "จมดิ่ง", "โหยหา", "แหลกสลาย", 
    "ถอนหายใจ", "ลืมตา", "คราบน้ำตา", "อ่อนล้า", "ลาก่อน", "อ้างว้าง", "สะอื้น", "ทิ้งขว้าง", "โหดร้าย", "แผลเป็น"
  ],
  angry: [
    "เปลวไฟ", "เดือดดาล", "แผดเผา", "คลุ้มคลั่ง", "ระเบิด", "ทำลายล้าง", "เกรี้ยวกราด", "แหลกเหลว", "โมโห", "บดขยี้", 
    "ขีดจำกัด", "ไม่ยอมแพ้", "แค้นเคือง", "ฟืนไฟ", "เดือดพล่าน", "พายุ", "ฉีกขาด", "โวยวาย", "เกลียดชัง", "รังเกียจ", 
    "หงุดหงิด", "ทนไม่ไหว", "กดดัน", "ต่อต้าน", "ท้าทาย", "เลือดเย็น", "ฟาดฟัน", "แผดเสียง", "ตะโกน", "คุกรุ่น"
  ],
  fear: [
    "สั่นเทา", "หวาดระแวง", "หนี", "มืดมิด", "ซ่อนตัว", "เสียงสะท้อน", "ลี้ภัย", "ฝันร้าย", "กังวล", "เข่าทรุด", 
    "เย็นเยียบ", "หายใจไม่ออก", "คุกเข่า", "มุมมืด", "หลงทาง", "สยดสยอง", "ปิดตา", "ทางตัน", "ขลาดเขลา", "ตื่นตระหนก", 
    "เสียงฝีเท้า", "หวาดผวา", "เงา", "สะดุ้ง", "ระวังตัว", "ไม่ปลอดภัย", "ขอบเหว", "หลอกหลอน", "อันตราย", "ไร้ทางออก"
  ],
  love: [
    "ผูกพัน", "โอบกอด", "ดวงดาว", "นิรันดร์", "เต้นแรง", "อ่อนโยน", "ทะนุถนอม", "ห่วงใย", "พรหมลิขิต", "หลงใหล", 
    "สายตา", "รอยจูบ", "จับมือ", "ลึกซึ้ง", "หวานใจ", "ดอกกุหลาบ", "เติมเต็ม", "คู่กัน", "ยอมทุกอย่าง", "เฝ้ารอ", 
    "สัญญา", "เคียงข้าง", "ละมุน", "ละลาย", "ทรงจำสีจาง", "ซื่อสัตย์", "ลมหายใจ", "แสงสว่าง", "อุ่นใจ", "ล้ำค่า"
  ],
  lonely: [
    "เดียวดาย", "ลำพัง", "เงียบเหงา", "ไร้เงา", "เคว้งคว้าง", "หนาวเหน็บ", "แปลกหน้า", "อ้างว้าง", "ไม่มีใคร", "ลอยคอ", 
    "ความว่างเปล่า", "ท่ามกลางผู้คน", "ห้องเดิมๆ", "รอคอย", "เข็มนาฬิกา", "ถอนใจ", "มองเหม่อ", "ปล่อยมือ", "โดดเดี่ยว", "เสียงลม", 
    "จางหาย", "ไร้จุดหมาย", "ไม่รับรู้", "โลกใบนี้", "เงาตัวเอง", "จม", "หายไป", "วันที่ยาวนาน", "กอดตัวเอง", "ที่ของฉัน"
  ],
  hope: [
    "รุ่งอรุณ", "แสงแรก", "ก้าวเดิน", "ศรัทธา", "วันพรุ่งนี้", "เริ่มต้นใหม่", "ปีก", "ทะยาน", "ความฝัน", "โอกาส", 
    "มุ่งมั่น", "ปลายทาง", "ดอกไม้บาน", "เชื่อมั่น", "ปาฏิหาริย์", "แสงสว่าง", "รอคอย", "ความจริง", "ก้าวผ่าน", "เติบโต", 
    "วันที่ดีกว่า", "รอยยิ้มแรก", "ดินแดน", "เมล็ดพันธุ์", "อธิษฐาน", "เข็มทิศ", "สัญญาณ", "ไม่ยอมแพ้", "ก้าวต่อไป", "ชีวิต"
  ],
  confused: [
    "หมอกควัน", "ทางแยก", "วังวน", "วงกต", "ไม่เข้าใจ", "พร่ามัว", "หลงทิศ", "คำถาม", "ลังเล", "สองจิตสองใจ", 
    "ปริศนา", "ซับซ้อน", "ยุ่งเหยิง", "พันกัน", "ค้นหา", "มืดมน", "ตัวเลือก", "ก้าวพลาด", "ภาพลวงตา", "เสียงรบกวน", 
    "ว้าวุ่น", "ไม่แน่นอน", "เคลือบแคลง", "ระแวง", "หลับตาเดิน", "ไร้คำตอบ", "หมุนวน", "สะท้อน", "กลืนไม่เข้า", "เงื่อนงำ"
  ],
  apathetic: [
    "ไร้สีสัน", "ว่างเปล่า", "ผ่านไป", "ลมพัด", "นาฬิกาทราย", "ชินชา", "ปล่อยวาง", "ฝุ่นควัน", "ลอยตัว", "ชั่วคราว", 
    "ความเงียบ", "ละเลย", "จืดจาง", "ไร้จุดหมาย", "เย็นชา", "มองข้าม", "นิ่งเฉย", "วันเดิมๆ", "เท่าเดิม", "ตามลม", 
    "ไร้น้ำหนัก", "ไม่คาดหวัง", "รอยเท้า", "ละออง", "หลุดพ้น", "ลืมเลือน", "เพียงผ่าน", "ไม่ผูกพัน", "ชั่วครู่", "ธุลี"
  ],
  exhausted: [
    "หมดแรง", "แบกรับ", "ถอนหายใจ", "หนักอึ้ง", "ล้มตัว", "พักผ่อน", "รอยย่น", "ทิ้งตัว", "ภาระ", "พอแล้ว", 
    "อ่อนล้า", "หลับตา", "เงาตะคุ่ม", "กัดฟัน", "ฝืนยิ้ม", "แบกโลก", "ลากขา", "ล้มลุก", "ร่วงหล่น", "ปล่อยมือ", 
    "คลาน", "สะสม", "ตึงเครียด", "สุดทาง", "นาฬิกาปลุก", "แบตเตอรี่", "หมดไฟ", "ฝืนทน", "ปิดสวิตช์", "หยาดเหงื่อ"
  ]
};
// 💡 วงกว้าง 110px ครึ่งนึงคือ 55px (calc(50% - 55px) จะทำให้อยู่ตรงกลางพอดีเป๊ะ)
const safePositions = [
  // --- โซนบน 5 วง (เกาะขอบบน) ---
  "top-[6%] left-[5%]",                     
  "top-[4%] right-[8%]",                    
  "top-[16%] left-[calc(50%-55px)]",        // 💡 แก้ตรงนี้ (ตรงกลางบน)
  "top-[28%] left-[8%]",                    
  "top-[26%] right-[5%]",                   

  // --- โซนล่าง 5 วง (เกาะขอบล่าง) ---
  "bottom-[28%] left-[6%]",                 
  "bottom-[26%] right-[8%]",                
  "bottom-[16%] left-[calc(50%-55px)]",     // 💡 แก้ตรงนี้ (ตรงกลางล่าง)
  "bottom-[4%] left-[8%]",                  
  "bottom-[6%] right-[5%]"                  
];

// 💡 เพิ่มการหมุน (rotate) เบาๆ และให้ duration แรนด้อมนิดหน่อยจะได้ไม่ลอยพร้อมกันหมด
const floatingAnimation = (delay: number, duration: number = 6): any => ({
  y: [-12, 12, -12],
  rotate: [-1.5, 1.5, -1.5], // เอียงซ้ายขวาเบาๆ
  transition: {
    duration: duration,
    ease: "easeInOut",
    repeat: Infinity,
    delay: delay
  }
});

const loadingPhrases = [
  "กำลังตกผลึกความรู้สึกของคุณ...",
  "บางครั้งคำตอบที่ดีที่สุด ซ่อนอยู่ในความรู้สึกเล็กๆ...",
  "จงใช้ความรู้สึกนี้ เป็นเข็มทิศของวันพรุ่งนี้...",
  "กำลังประกอบร่างถ้อยคำ เพื่อคุณคนเดียว..."
];
// --- Helper Component สำหรับ Bubble (อัปเกรด Glow Effect) ---
const Circle = ({ mood, pos, delay, index, onStart }: any) => {
  // 💡 สร้างฟังก์ชันคืนค่าทั้งสีขอบและสีเงาเรืองแสง
  const getThemeColors = (id: string) => {
    const themes: Record<string, { border: string, shadow: string }> = {
      happy: { border: "#facc15", shadow: "rgba(250, 204, 21, 0.3)" },     // Yellow
      sad: { border: "#60a5fa", shadow: "rgba(96, 165, 250, 0.3)" },       // Blue
      angry: { border: "#ef4444", shadow: "rgba(239, 68, 68, 0.3)" },      // Red
      fear: { border: "#a855f7", shadow: "rgba(168, 85, 247, 0.3)" },      // Purple
      love: { border: "#ec4899", shadow: "rgba(236, 72, 153, 0.3)" },      // Pink
      lonely: { border: "#78716c", shadow: "rgba(120, 113, 108, 0.2)" },   // Stone
      hope: { border: "#34d399", shadow: "rgba(52, 211, 153, 0.3)" },      // Emerald
      confused: { border: "#818cf8", shadow: "rgba(129, 140, 248, 0.3)" }, // Indigo
      apathetic: { border: "#94a3b8", shadow: "rgba(148, 163, 184, 0.2)" },// Slate
      exhausted: { border: "#fb923c", shadow: "rgba(251, 146, 60, 0.3)" }  // Orange
    };
    return themes[id] || { border: "#e5e7eb", shadow: "rgba(0,0,0,0.05)" };
  };

  const theme = getThemeColors(mood.id);
  // สุ่มความเร็วลอยให้แต่ละลูกไม่เท่ากัน (ระหว่าง 5-8 วินาที)
  const duration = 5 + (index % 4); 

  return (
    <motion.button 
      animate={floatingAnimation(delay, duration)}
      onClick={() => onStart(mood)}
      className={`absolute ${pos} w-[110px] h-[110px] rounded-full border-[2.5px] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all bg-white/90 backdrop-blur-sm shrink-0 z-20 hover:scale-105`}
      style={{ 
        borderColor: theme.border,
        boxShadow: `0 10px 25px -5px ${theme.shadow}, 0 8px 10px -6px ${theme.shadow}` // 💡 เพิ่มเงาเรืองแสง
      }}
    >
      <span className="text-5xl mb-0.5 drop-shadow-sm">{mood.icon}</span>
      <span className="font-extrabold text-[12px] text-stone-700 tracking-tight text-center px-1 leading-none">{mood.title}</span>
    </motion.button>
  );
};

export default function SwipeQuoteApp() {
  const [gameState, setGameState] = useState<"start" | "swiping" | "generating" | "result">("start");
  const [playerMood, setPlayerMood] = useState<{id: string, title: string} | null>(null);
  const [deck, setDeck] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  const [collectedWords, setCollectedWords] = useState<string[]>([]);
  const [finalQuote, setFinalQuote] = useState("");

  const [isMounted, setIsMounted] = useState(false);
  const [randomizedMoods, setRandomizedMoods] = useState<any[]>([]);

  const quoteCardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    const shuffled = [...moodOptions].sort(() => Math.random() - 0.5);
    setRandomizedMoods(shuffled);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let interval: any;
    if (gameState === "generating") {
      setLoadingTextIndex(0); 
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState]);

  const handleSaveImage = async () => {
    if (!quoteCardRef.current) return;
    
    setIsSaving(true);
    try {
      const dataUrl = await toPng(quoteCardRef.current, {
        quality: 1,
        pixelRatio: 2, 
        backgroundColor: "#1c1917" 
      });
      
      const link = document.createElement("a");
      link.download = `khomsatsat-${Date.now()}.png`; 
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Save image failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacityNope = useTransform(x, [-100, -20], [1, 0]);
  const opacityLike = useTransform(x, [20, 100], [0, 1]);
  const cardScale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 80;
    if (info.offset.x > swipeThreshold) handleSwipeRight();
    else if (info.offset.x < -swipeThreshold) handleSwipeLeft();
  };

  const handleSwipeRight = () => {
    const word = deck[currentCardIndex];
    const newCollected = [...collectedWords, word];
    setCollectedWords(newCollected);
    
    if (newCollected.length === 3) {
      processAIGeneration(newCollected);
    } else {
      nextCard();
    }
  };

  const handleSwipeLeft = () => {
    nextCard();
  };

  const nextCard = () => {
    setCurrentCardIndex(prev => (prev < deck.length - 1 ? prev + 1 : 0));
  };

  const startGame = (mood: {id: string, title: string}) => {
    setPlayerMood(mood);
    const moodKey = mood.id as keyof typeof abstractWords;
    const words = abstractWords[moodKey].sort(() => Math.random() - 0.5);
    setDeck(words);
    setGameState("swiping");
  };

  const processAIGeneration = async (wordsToUse: string[]) => {
    setGameState("generating");
    
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: playerMood?.title,
          words: wordsToUse
        })
      });

      const data = await response.json();
      setFinalQuote(data.quote);
      setGameState("result");
      
    } catch (error) {
      console.error("API Error", error);
      setFinalQuote(`ท่ามกลางความรู้สึก "${wordsToUse[0]}" และ "${wordsToUse[1]}"...\nจงใช้ "${wordsToUse[2]}" เป็นคำตอบของวันนี้.`);
      setGameState("result");
    }
  };

  const resetApp = () => {
    setGameState("start"); setPlayerMood(null);
    setCurrentCardIndex(0); setCollectedWords([]);
    setRandomizedMoods([...moodOptions].sort(() => Math.random() - 0.5));
  };

  const getActiveThemeClasses = () => {
    if (!playerMood) return "border-stone-500 text-stone-400"; 
    const currentMoodInfo = moodOptions.find(m => m.id === playerMood.id);
    if (!currentMoodInfo) return "border-stone-500 text-stone-400";
    const classes = currentMoodInfo.theme.split(" ");
    return `${classes[0]} ${classes[2]}`; 
  };

  const timestamp = new Date().toLocaleString('th-TH', { 
    year: 'numeric', month: 'short', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });

  return (
    <div className={`min-h-[100dvh] bg-stone-100 flex flex-col items-center justify-center sm:p-4 ${kanit.className} overflow-hidden`}>
      <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden h-[100dvh] sm:h-[850px] flex flex-col relative sm:rounded-[2.5rem] sm:border-[4px] sm:border-stone-900">
        
        {/* === 1. START SCREEN === */}
   {/* === 1. START SCREEN === */}
{gameState === "start" && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-6 text-center relative bg-stone-50 h-full w-full overflow-hidden">
    
    {/* 💡 เพิ่มลาย Dot Grid จางๆ สไตล์ Modern Web */}
    <div className="absolute inset-0 z-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

    <div className="absolute inset-0 w-full h-full z-10" style={{ opacity: isMounted ? 1 : 0 }}>
      {isMounted && randomizedMoods.map((mood, index) => (
        <Circle key={mood.id} mood={mood} pos={safePositions[index]} delay={index * 0.4} index={index} onStart={startGame} />
      ))}
    </div>

    {/* โลโก้ตรงกลาง มีแสงออร่าสีขาวข้างหลัง */}
    <div className="relative z-30 pointer-events-none flex flex-col items-center justify-center w-[250px] h-[250px]">
       {/* 💡 ออร่าสีขาวรองพื้นโลโก้ */}
      <div className="absolute inset-0 bg-white/70 blur-2xl rounded-full"></div>
      
      <div className="relative z-10">
        <h1 className="text-6xl font-black mb-1 leading-tight tracking-tighter text-stone-900 drop-shadow-sm">
          {"คมสัด"}<span className="text-blue-600">สัด</span>
        </h1>
        <p className="text-stone-500 text-[13px] font-medium tracking-wide px-1">
          เลือกสิ่งที่ "ทัช" ในใจ ให้เป็นคำคมเฉพาะคุณ
        </p>
      </div>
      {/* 💡 ปุ่มกดไปดู Gallery เพิ่มตรงนี้ */}
    <Link href="/gallery" className="relative z-30 mt-6 px-6 py-2.5 bg-stone-900 text-white rounded-full text-[12px] font-bold tracking-wide shadow-lg hover:bg-stone-800 hover:scale-105 transition-all flex items-center gap-2">
      ดูแกลเลอรีคำคม <ChevronRight size={14} />
    </Link>
    </div>

    <p className="absolute bottom-6 text-[9px] text-stone-400 font-black uppercase tracking-[0.2em] z-30 bg-white/50 px-3 py-1 rounded-full backdrop-blur-md">
      Khomsatsat x Upskill with Fuii
    </p>
  </motion.div>
)}

     {/* === 2. SWIPING SCREEN (แก้ไขให้สวยขึ้น) === */}
{gameState === "swiping" && deck.length > 0 && (
  <div className="flex-1 flex flex-col bg-stone-50 relative overflow-hidden h-full">
    {/* ส่วนหัวสะสมคำ */}
    <div className="pt-12 pb-6 px-6 bg-white border-b border-stone-200 flex flex-col items-center justify-center z-10 shadow-sm relative">
      <button onClick={resetApp} className="absolute left-6 top-14 p-2 bg-stone-100 rounded-full hover:bg-stone-200 text-stone-600 transition-colors">
        <ChevronLeft size={20} />
      </button>
      <h2 className="text-[13px] font-bold text-stone-400 uppercase tracking-widest mb-3">สะสมคำที่ทัชใจ</h2>
      <div className="flex gap-2.5">
        {[0, 1, 2].map(slot => (
          <div key={slot} className={`w-18 h-9 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${collectedWords[slot] ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-stone-100 border-stone-200 text-transparent'}`}>
            {collectedWords[slot] || "?"}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-medium text-stone-400">
        <span className="flex items-center gap-1"><ChevronLeft size={14} /> ปัดซ้าย เพื่อข้าม</span>
        <span className="w-px h-3 bg-stone-300"></span>
        <span className="flex items-center gap-1">ปัดขวา เพื่อเลือก <ChevronRight size={14} /></span>
      </div>
    </div>

    {/* พื้นที่การปัดคำ (เพิ่มมิติให้สวยขึ้น) */}
    <div className="flex-1 flex flex-col items-center justify-center relative w-full px-6 py-10">
      <AnimatePresence>
        <motion.div
          key={currentCardIndex}
          style={{ x, rotate, scale: cardScale }}
          drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleDragEnd}
          initial={{ scale: 0.8, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.15 } }}
          className="absolute w-full max-w-[310px] aspect-square bg-white rounded-full shadow-[0_25px_60px_rgba(0,0,0,0.1)] border-[6px] border-white flex flex-col items-center justify-center p-8 cursor-grab active:cursor-grabbing z-20"
        >
          {/* ป้ายกำกับ ข้าม/เอาคำนี้ (Yup/Like) */}
          <motion.div style={{ opacity: opacityNope }} className="absolute top-12 right-0 border-[4px] border-stone-400 text-stone-400 font-black text-2xl px-5 py-1.5 rounded-2xl rotate-[20deg] pointer-events-none z-30 uppercase">ข้าม</motion.div>
          <motion.div style={{ opacity: opacityLike }} className="absolute top-12 left-0 border-[4px] border-blue-600 text-blue-600 font-black text-2xl px-5 py-1.5 rounded-2xl -rotate-[20deg] pointer-events-none z-30 uppercase">เอาคำนี้</motion.div>
          
          {/* ตัวคำ (ขยายขนาด, ตัวหนา, เพิ่มเงา) */}
          <h3 className="text-[42px] font-black text-stone-900 text-center leading-tight tracking-tight drop-shadow-sm">
            {deck[currentCardIndex]}
          </h3>
        </motion.div>
      </AnimatePresence>
      {/* การ์ดซ้อนหลัง (เอฟเฟกต์มิติ) */}
      <div className="absolute w-full max-w-[310px] aspect-square bg-white rounded-full shadow-sm border-[6px] border-white -z-10 scale-[0.92] translate-y-8"></div>
    </div>

    {/* ส่วนท้ายที่เป็นไอคอนการปัด */}
    <div className="pb-16 pt-6 flex justify-between items-center w-full px-20 text-[14px] font-bold tracking-widest relative z-20">
      <button onClick={handleSwipeLeft} className="flex flex-col items-center gap-1.5 text-stone-500 hover:text-stone-700 transition-colors">
        <span className="p-3.5 bg-stone-100 rounded-full">
          <X size={26} />
        </span>
        ไม่รู้สึก
      </button>
      <button onClick={handleSwipeRight} className="flex flex-col items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors">
        <span className="p-3.5 bg-blue-50 rounded-full shadow-inner">
          <Check size={26} />
        </span>
        ทัชใจ
      </button>
    </div>
  </div>
)}

        {/* === 3. GENERATING (อัปเกรดความพรีเมียม & อนิเมชันหลอมรวม) === */}
{gameState === "generating" && (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-stone-950 relative overflow-hidden"
  >
    {/* 💡 1. แสงออร่าพื้นหลัง (Animated Gradient Pulse) */}
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.3, 0.15]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/40 via-stone-950 to-stone-950 pointer-events-none"
    />

    {/* 💡 2. ตัวโหลดข้อมูลซ้อน Layer (Advanced Loader) */}
    <div className="relative mb-10 z-10 flex items-center justify-center">
      {/* แสงเรืองรองใต้ Loader */}
      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
      
      {/* วงแหวนหมุนด้านนอก */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute w-20 h-20 border-[3px] border-stone-800/80 border-t-blue-500 rounded-full"
      />
      
      {/* ไอคอนหมุนด้านใน */}
      <Loader2 size={36} className="text-blue-400 animate-spin" />
    </div>
    
    {/* 💡 3. ข้อความบิ๊วอารมณ์ (สมูทขึ้นด้วย Blur Transition) */}
    <AnimatePresence mode="wait">
      <motion.h2 
        key={loadingTextIndex}
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-[18px] sm:text-[20px] font-bold text-stone-100 mb-4 relative z-10 h-14 flex items-center justify-center drop-shadow-md tracking-wide" 
      >
        {loadingPhrases[loadingTextIndex]}
      </motion.h2>
    </AnimatePresence>

    {/* 💡 4. แท็กคำศัพท์ที่ค่อยๆ เด้งขึ้นมาทีละคำ (Staggered Entrance) */}
    <div className="flex gap-2.5 justify-center mt-4 relative z-10">
      {collectedWords.map((w, i) => (
        <motion.span 
          key={i} 
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.3, duration: 0.5, type: "spring" }} // เด้งดึ๋งเบาๆ ทีละคำ
          className="text-[12px] font-bold bg-white/5 text-stone-300 px-4 py-1.5 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.03)] backdrop-blur-md"
        >
          {w}
        </motion.span>
      ))}
    </div>
  </motion.div>
)}

        {/* === 4. RESULT SCREEN === */}
      {/* === 4. RESULT SCREEN (เวอร์ชันสวยขึ้น พรีเมียมขึ้น แก้ปัญหาบรรทัดล้น) === */}
{gameState === "result" && (
  <div className="flex-1 flex flex-col bg-stone-900 relative h-full overflow-hidden">
    
    {/* ✨ พื้นที่แคปเจอร์ภาพ (Glow Background และ Typography Optimized) ✨ */}
    <div 
      ref={quoteCardRef} 
      className="flex-1 flex flex-col items-center justify-center text-center p-10 relative bg-stone-900"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #262626 0%, #1c1917 100%)'
      }}
    >
      {/* Dynamic Background Glow - แสงออร่าตามสีอารมณ์ข้างหลัง (Glow Effect) */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${playerMood ? moodOptions.find(m => m.id === playerMood.id)?.theme.split(" ")[2].replace("text-", "#").replace("-600", "") || "#2563eb" : "#2563eb"} 0%, transparent 70%)`
        }}
      ></div>

      {/* Quote Icon - ปรับจูน Typography ให้เท่ขึ้น */}
      <Quote size={32} className="text-blue-500/20 absolute top-12 left-10 -rotate-12 drop-shadow-sm" />

      <div className="relative z-10 w-full flex flex-col items-center gap-10">
        
        {/* ส่วนคำคม: Algorithm การเรนเดอร์ Optimized บรรทัด */}
        <div className="w-full max-w-[95%] px-2 flex flex-col items-center gap-2.5 sm:gap-3">
          {finalQuote.replace(/\\n/g, '\n').split('\n').map((line, idx) => {
            if (!line.trim()) return null;
            return (
              <span 
                key={idx}
                className="text-[22px] sm:text-[26px] font-bold leading-normal text-stone-100 tracking-tight text-center break-words drop-shadow-md"
                style={{ 
                  backgroundImage: 'linear-gradient(180deg, transparent 60%, rgba(37, 99, 235, 0.4) 60%)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%',
                  padding: '0 6px', // เพิ่มพื้นที่ซ้ายขวาให้พื้นหลังนิดหน่อย
                }}
              >
                {line.trim()}
              </span>
            );
          })}
        </div>

        {/* จุดคั่นกลางมินิมอล */}
        <div className="flex gap-1.5 opacity-20 drop-shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-stone-500"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-stone-500"></div>
        </div>

        {/* แท็กคำศัพท์: Glow Effect ตามสีอารมณ์ */}
        <div className="flex flex-wrap justify-center items-center gap-3">
          {collectedWords.map((w, i) => (
            <span 
              key={i} 
              className={`text-[11px] font-bold px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md whitespace-nowrap ${getActiveThemeClasses()}`}
              style={{
                boxShadow: `0 8px 15px -3px ${playerMood ? moodOptions.find(m => m.id === playerMood.id)?.theme.split(" ")[2].replace("text-", "rgba(").replace("-600", ", 0.2)") || "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.2)"}` // 💡 เพิ่มเงาเรืองแสงอ่อนๆ
              }}
            >
              # {w}
            </span>
          ))}
        </div>
      </div>

      {/* ลายน้ำแบรนด์ คมสัดสัด - ปรับปรุงความชัดเจนและตำแหน่ง */}
      <div className="absolute bottom-8 flex flex-col items-center gap-1.5 opacity-40">
        <div className="text-[9px] font-black tracking-[0.4em] text-stone-500 uppercase drop-shadow-sm">
          KHOMSATSAT <span className="text-blue-500/50">×</span> UPSKILL WITH FUII
        </div>
        <div className="text-[10px] font-medium tracking-wider text-stone-500">
          {timestamp}
        </div>
      </div>
    </div>
    
    {/* === โซนปุ่มควบคุม (UI) - ปรับจูนให้ดูแน่นขึ้น === */}
    <div className="p-6 pb-8 bg-stone-950/90 backdrop-blur-xl border-t border-stone-800/50 flex flex-col gap-3 shrink-0">
      
      <button 
        onClick={handleSaveImage}
        disabled={isSaving}
        className="w-full bg-white text-stone-900 font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-[16px] active:scale-[0.97] transition-all disabled:opacity-50"
      >
        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        {isSaving ? "กำลังบันทึกภาพ..." : "เซฟคำคมลงเครื่อง"}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={resetApp} 
          className="py-3.5 bg-stone-800 text-stone-400 font-bold rounded-xl text-[13px] flex items-center justify-center gap-2 hover:bg-stone-700 active:scale-95 transition-all"
        >
          <RefreshCcw size={15}/> สุ่มใหม่
        </button>

        <a 
          href="https://lin.ee/rQawKUM" 
          target="_blank"
          rel="noopener noreferrer"
          className="py-3.5 bg-blue-600 text-white font-bold rounded-xl text-[13px] flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-900/20 transition-all"
        >
          <Heart size={15} className="fill-current"/> 
          ติดตามอัพสกิลกับฟุ้ย
        </a>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}