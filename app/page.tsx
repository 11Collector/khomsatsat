"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react"; 
import { motion, AnimatePresence, useMotionValue, useTransform} from "framer-motion";
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

  "bottom-[34%] left-[6%]",                 // 💡 ขยับขึ้นจาก 28% -> 34%
  "bottom-[32%] right-[8%]",                // 💡 ขยับขึ้นจาก 26% -> 32%
  "bottom-[22%] left-[calc(50%-55px)]",     // 💡 ขยับตรงกลางขึ้นจาก 16% -> 22%
  "bottom-[8%] left-[10%]",                 // 💡 ขยับขอบล่างขึ้นนิดหน่อยให้สมดุล
  "bottom-[10%] right-[7%]"              
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
  "กำลังจับความรู้สึกของคุณตอนนี้...",
  "รอหน่อยนะ... กำลังหาคำที่ทัชใจให้ ✨",
  "ทุกความรู้สึกเมคเซนส์ในแบบของมัน",
  "เตรียมแคปได้เลย ประโยคนี้เพื่อแก 📸"
];
// --- Helper Component สำหรับ Bubble ---
// 💡 ตรงนี้ต้องมีคำว่า index ด้วย
const Circle = ({ mood, pos, delay, index, onStart }: any) => {
 const getThemeColors = (id: string) => {
    const themes: Record<string, { border: string, shadow: string }> = {
      happy: { border: "#facc15", shadow: "rgba(250, 204, 21, 0.3)" },     
      sad: { border: "#60a5fa", shadow: "rgba(96, 165, 250, 0.3)" },       
      angry: { border: "#ef4444", shadow: "rgba(239, 68, 68, 0.3)" },      
      fear: { border: "#a855f7", shadow: "rgba(168, 85, 247, 0.3)" },      
      love: { border: "#ec4899", shadow: "rgba(236, 72, 153, 0.3)" },      
      lonely: { border: "#78716c", shadow: "rgba(120, 113, 108, 0.2)" },   
      hope: { border: "#34d399", shadow: "rgba(52, 211, 153, 0.3)" },      
      confused: { border: "#818cf8", shadow: "rgba(129, 140, 248, 0.3)" }, 
      apathetic: { border: "#94a3b8", shadow: "rgba(148, 163, 184, 0.2)" },
      exhausted: { border: "#fb923c", shadow: "rgba(251, 146, 60, 0.3)" }  
    };
    return themes[id] || { border: "#e5e7eb", shadow: "rgba(0,0,0,0.05)" };
  };

  const theme = getThemeColors(mood.id);
  // 💡 เอา index มาคำนวณความเร็วให้แต่ละลูกลอยไม่เท่ากัน
  const duration = 5 + ((index || 0) % 4); 

  return (
    <motion.button 
      animate={floatingAnimation(delay, duration)}
      onClick={() => onStart(mood)}
      className={`absolute ${pos} w-[110px] h-[110px] rounded-full border-[2.5px] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all bg-white/90 backdrop-blur-sm shrink-0 z-20 hover:scale-105`}
      style={{ 
        borderColor: theme.border,
        boxShadow: `0 10px 25px -5px ${theme.shadow}, 0 8px 10px -6px ${theme.shadow}`
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
        // 💡 เปลี่ยนสีรองพื้นตอนแคปเจอร์เป็นสีสว่าง (stone-50) ให้ตรงกับหน้าเว็บ
        backgroundColor: "#fafaf9", 
        style: {
          transform: 'scale(1)', // 💡 ป้องกันบัคแคปรูปแล้วเบี้ยวถ้าจอซูมอยู่
        }
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
        {gameState === "start" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-6 text-center relative bg-stone-50 h-full w-full overflow-hidden">
            
         <Link 
              href="/gallery" 
              className="absolute top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 bg-stone-900 text-white rounded-full text-[13px] font-bold tracking-wide shadow-lg hover:bg-stone-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              แกลเลอรีคำคม <ChevronRight size={14} />
            </Link>

            {/* ลายจุด Polkadot ฉากหลัง */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

            {/* กลุ่มวงกลมอารมณ์ */}
            <div className="absolute inset-0 w-full h-full z-10" style={{ opacity: isMounted ? 1 : 0 }}>
              {isMounted && randomizedMoods.map((mood, idx) => (
                <Circle 
                  key={mood.id} 
                  mood={mood} 
                  pos={safePositions[idx]} 
                  delay={idx * 0.4} 
                  index={idx} 
                  onStart={startGame} 
                />
              ))}
            </div>

            <div className="relative z-30 flex flex-col items-center -translate-y-8 pointer-events-none">
              
              {/* กล่องโลโก้แบบ "ขอบจางหาย" */}
              <div className="relative pointer-events-none p-12 flex flex-col items-center justify-center w-[350px] h-[220px]">
                
                <div className="absolute inset-0 bg-white/95 blur-3xl rounded-full"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <h1 className="text-6xl font-black mb-1.5 leading-tight tracking-tighter text-stone-900 drop-shadow-sm">
                    {"คมสัด"}<span className="text-blue-600">สัด</span>
                  </h1>
                  <p className="text-stone-500 text-[13px] font-medium tracking-wide px-1 drop-shadow-sm">
                    เลือกสิ่งที่ "ทัช" ในใจ ให้เป็นคำคมเฉพาะคุณ
                  </p>
                </div>
                
              </div>
              
              {/* 💡 เอา Link เดิมที่เคยอยู่ตรงนี้ออกไปแล้ว */}

            </div>

            <p className="absolute bottom-6 text-[9px] text-stone-400 font-black uppercase tracking-[0.2em] z-30 bg-white/50 px-3 py-1 rounded-full backdrop-blur-md pointer-events-none">
              Khomsatsat x Upskill with Fuii
            </p>
          </motion.div>
        )}

{/* === 2. SWIPING SCREEN (อัปเกรดสไตล์ Gen Z & Glassmorphism ✨) === */}
        {gameState === "swiping" && deck.length > 0 && (
          <div className="flex-1 flex flex-col bg-stone-50 relative overflow-hidden h-full">
            
            {/* 💡 1. ฉากหลัง Polkadot และแสง Glow ตามอารมณ์ */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
            <div 
              className="absolute inset-0 opacity-30 blur-[100px] pointer-events-none transition-all duration-700"
              style={{
                background: `radial-gradient(circle at center 40%, ${playerMood ? ({happy: "#facc15", sad: "#60a5fa", angry: "#ef4444", fear: "#a855f7", love: "#ec4899", lonely: "#78716c", hope: "#34d399", confused: "#818cf8", apathetic: "#94a3b8", exhausted: "#fb923c"})[playerMood.id] || "#3b82f6" : "#3b82f6"} 0%, transparent 60%)`
              }}
            ></div>

            {/* 💡 2. ส่วนหัวสะสมคำ (ปรับเป็น Glassmorphism) */}
            <div className="pt-10 pb-5 px-6 bg-white/60 backdrop-blur-xl border-b border-white shadow-sm flex flex-col items-center justify-center z-10 relative">
              <button onClick={resetApp} className="absolute left-6 top-10 p-2.5 bg-white rounded-full hover:bg-stone-100 text-stone-600 transition-colors shadow-sm border border-stone-100">
                <ChevronLeft size={20} />
              </button>
              
              <h2 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">สะสมคำที่ทัชใจ</h2>
              
              {/* ช่องใส่คำที่เลือก */}
              <div className="flex gap-3">
                {[0, 1, 2].map(slot => {
                  const hasWord = !!collectedWords[slot];
                  const activeColor = playerMood ? ({happy: "#facc15", sad: "#60a5fa", angry: "#ef4444", fear: "#a855f7", love: "#ec4899", lonely: "#78716c", hope: "#34d399", confused: "#818cf8", apathetic: "#94a3b8", exhausted: "#fb923c"})[playerMood.id] || "#3b82f6" : "#3b82f6";
                  
                  return (
                    <div 
                      key={slot} 
                      className={`w-20 h-10 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300 ${
                        hasWord 
                          ? 'text-white shadow-lg border-2' 
                          : 'bg-white/50 border-2 border-dashed border-stone-300 text-transparent'
                      }`}
                      style={hasWord ? { backgroundColor: activeColor, borderColor: activeColor, boxShadow: `0 8px 15px -3px ${activeColor}60` } : {}}
                    >
                      {collectedWords[slot] || "?"}
                    </div>
                  );
                })}
              </div>

              {/* Tag คำแนะนำการปัด */}
              <div className="mt-4 flex items-center justify-center gap-3 text-[10px] font-extrabold text-stone-400 bg-white/80 px-4 py-1.5 rounded-full border border-stone-100 shadow-sm">
                <span className="flex items-center gap-1 uppercase tracking-wider"><ChevronLeft size={12} className="text-stone-300" /> ปัดซ้ายทิ้ง</span>
                <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                <span className="flex items-center gap-1 uppercase tracking-wider">ปัดขวาเลือก <ChevronRight size={12} className="text-stone-300" /></span>
              </div>
            </div>

            {/* 💡 3. พื้นที่การปัดคำ (การ์ดกระจกมีมิติ) */}
            <div className="flex-1 flex flex-col items-center justify-center relative w-full px-4 overflow-hidden">
              <AnimatePresence>
                <motion.div
                  key={currentCardIndex}
                  style={{ x, rotate, scale: cardScale }}
                  drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleDragEnd}
                  initial={{ scale: 0.8, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.15 } }}
                  // ปรับการ์ดหลักให้เป็นกระจกใส และขอบหนา
                  className="absolute w-[75vw] max-w-[280px] aspect-square bg-white/80 backdrop-blur-xl rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border-[8px] border-white flex flex-col items-center justify-center p-6 cursor-grab active:cursor-grabbing z-20"
                >
                  {/* แสตมป์ "ข้าม" */}
                  <motion.div 
                    style={{ opacity: opacityNope }} 
                    className="absolute top-8 right-0 border-[4px] border-stone-300 text-stone-400 font-black text-xl px-4 py-1.5 rounded-2xl rotate-[20deg] pointer-events-none z-30 uppercase bg-white/90 backdrop-blur-md shadow-sm"
                  >
                    ข้าม
                  </motion.div>

                  {/* แสตมป์ "เอาคำนี้" (สีเปลี่ยนตามอารมณ์) */}
                  <motion.div 
                    style={{ 
                      opacity: opacityLike,
                      borderColor: playerMood ? ({happy: "#facc15", sad: "#60a5fa", angry: "#ef4444", fear: "#a855f7", love: "#ec4899", lonely: "#78716c", hope: "#34d399", confused: "#818cf8", apathetic: "#94a3b8", exhausted: "#fb923c"})[playerMood.id] || "#3b82f6" : "#3b82f6",
                      color: playerMood ? ({happy: "#facc15", sad: "#60a5fa", angry: "#ef4444", fear: "#a855f7", love: "#ec4899", lonely: "#78716c", hope: "#34d399", confused: "#818cf8", apathetic: "#94a3b8", exhausted: "#fb923c"})[playerMood.id] || "#3b82f6" : "#3b82f6"
                    }} 
                    className="absolute top-8 left-0 border-[4px] font-black text-xl px-4 py-1.5 rounded-2xl -rotate-[20deg] pointer-events-none z-30 uppercase bg-white/90 backdrop-blur-md shadow-sm"
                  >
                    เอาคำนี้
                  </motion.div>
                  
                  {/* ตัวคำ (จัด Font ให้เท่ขึ้น) */}
                  <h3 className="text-[34px] sm:text-[42px] font-black text-stone-900 text-center leading-tight tracking-tighter drop-shadow-sm px-2">
                    {deck[currentCardIndex]}
                  </h3>
                </motion.div>
              </AnimatePresence>
              
              {/* การ์ดซ้อนหลัง (เอฟเฟกต์มิติ Glassmorphism) */}
              <div className="absolute w-[75vw] max-w-[280px] aspect-square bg-white/40 backdrop-blur-md rounded-full border-[4px] border-white/60 -z-10 scale-[0.90] translate-y-8 shadow-sm"></div>
            </div>

            {/* 💡 4. ส่วนท้ายที่เป็นไอคอนการปัด (ลอยตัวขึ้นนิดหน่อย) */}
            <div className="pb-10 pt-4 flex justify-between items-center w-full px-14 sm:px-20 relative z-20">
              <button onClick={handleSwipeLeft} className="flex flex-col items-center gap-2 group transition-all active:scale-95">
                <span className="p-4 bg-white border border-stone-100 rounded-full shadow-md text-stone-400 group-hover:bg-stone-50 group-hover:text-stone-600 transition-all">
                  <X size={26} strokeWidth={3} />
                </span>
                <span className="text-[12px] font-black tracking-widest text-stone-400 uppercase">ไม่รู้สึก</span>
              </button>
              
             <button onClick={handleSwipeRight} className="flex flex-col items-center gap-2 group transition-all active:scale-95">
                <span 
                  className="p-4 rounded-full shadow-lg border-2 transition-all group-hover:scale-105"
                  style={{
                    // 💡 เติม : "#dbeafe" ปิดท้ายเงื่อนไขเรียบร้อย
                    backgroundColor: playerMood ? ({happy: "#fef08a", sad: "#dbeafe", angry: "#fee2e2", fear: "#f3e8ff", love: "#fce7f3", lonely: "#f5f5f4", hope: "#d1fae5", confused: "#e0e7ff", apathetic: "#f1f5f9", exhausted: "#ffedd5"})[playerMood.id] || "#dbeafe" : "#dbeafe",
                    borderColor: playerMood ? ({happy: "#facc15", sad: "#60a5fa", angry: "#ef4444", fear: "#a855f7", love: "#ec4899", lonely: "#78716c", hope: "#34d399", confused: "#818cf8", apathetic: "#94a3b8", exhausted: "#fb923c"})[playerMood.id] || "#3b82f6" : "#3b82f6",
                    color: playerMood ? ({happy: "#eab308", sad: "#3b82f6", angry: "#ef4444", fear: "#9333ea", love: "#db2777", lonely: "#57534e", hope: "#10b981", confused: "#6366f1", apathetic: "#64748b", exhausted: "#f97316"})[playerMood.id] || "#3b82f6" : "#3b82f6"
                  }}
                >
                  <Check size={26} strokeWidth={3} />
                </span>
                <span 
                  className="text-[12px] font-black tracking-widest uppercase"
                  style={{ color: playerMood ? ({happy: "#eab308", sad: "#3b82f6", angry: "#ef4444", fear: "#9333ea", love: "#db2777", lonely: "#57534e", hope: "#10b981", confused: "#6366f1", apathetic: "#64748b", exhausted: "#f97316"})[playerMood.id] || "#3b82f6" : "#3b82f6" }}
                >
                  ทัชใจ
                </span>
              </button>
            </div>
            
          </div>
        )}

   {/* === 3. GENERATING (อัปเกรดให้ดูเท่ๆ สดใสแบบ Genz & Colorful) === */}
{gameState === "generating" && (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-stone-950 relative overflow-hidden"
  >
    {/* 💡 1. แสงออร่าพื้นหลังแบบ Iridescent Multi-Color (เคลื่อนไหวและสีสันสดใส) */}
    <motion.div 
      animate={{ 
        scale: [1, 1.3, 1],
        rotate: [0, 5, 0],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/50 via-cyan-500/30 to-stone-950 pointer-events-none"
    />
    <motion.div 
      animate={{ 
        scale: [1.2, 1, 1.2],
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-magenta-500/30 via-transparent to-stone-950 pointer-events-none blur-3xl"
    />

    {/* 💡 2. ตัวโหลดข้อมูลซ้อน Layer (เปลี่ยนจาก Concentric Rings เป็น Energetic Sphere Cluster) */}
    <div className="relative mb-14 z-10 flex items-center justify-center w-36 h-36">
      
      {/* วงแหวนและแสงเรืองรองกลางวง (Center Glow & Rings) */}
      <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-28 h-28 border border-white/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute w-20 h-20 border-2 border-dashed border-white/30 rounded-full"
      />

      {/* กลุ่ม Spheres เคลื่อนไหว (Spherical Orbit Loader) */}
      {[ 
        { color: "cyan", size: 10, offset: "-2.5rem" }, 
        { color: "magenta", size: 14, offset: "2rem" }, 
        { color: "purple", size: 8, offset: "1.5rem", y: "2rem" }, 
        { color: "yellow", size: 11, offset: "-1.5rem", y: "-2.5rem" },
        { color: "blue", size: 10, offset: "0rem", y: "0rem" }
      ].map((s, idx) => (
        <motion.div
          key={idx}
          className={`absolute rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]`}
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color === "cyan" ? "#22d3ee" : s.color === "magenta" ? "#ec4899" : s.color === "purple" ? "#a855f7" : s.color === "yellow" ? "#facc15" : "#3b82f6",
            translateX: s.offset,
            translateY: s.y || "0rem",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
            translateX: [s.offset, idx % 2 === 0 ? "3rem" : "-3rem", s.offset],
            translateY: [s.y || "0rem", idx % 2 === 0 ? "-2rem" : "2rem", s.y || "0rem"],
          }}
          transition={{
            duration: 4 + idx * 0.5,
            repeat: Infinity,
            delay: idx * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
      
    </div>
    
    {/* 💡 3. ข้อความบิ๊วอารมณ์ (เปลี่ยนสีและเพิ่มสีสันที่ Text Transition) */}
    <AnimatePresence mode="wait">
      <motion.h2 
        key={loadingTextIndex}
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-[19px] sm:text-[22px] font-bold mb-4 relative z-10 h-16 flex items-center justify-center drop-shadow-md tracking-wide text-white" 
        style={{
          textShadow: '0 0 10px rgba(34, 211, 236, 0.6), 0 0 20px rgba(236, 72, 153, 0.6)'
        }}
      >
        {loadingPhrases[loadingTextIndex]}
      </motion.h2>
    </AnimatePresence>

    {/* 💡 4. แท็กคำศัพท์ที่ค่อยๆ เด้งขึ้นมาทีละคำ (เปลี่ยนสีและเพิ่มขอบ/สีสัน) */}
    <div className="flex gap-2.5 justify-center mt-6 relative z-10">
      {[ {text: collectedWords[0], color: "cyan"}, {text: collectedWords[1], color: "magenta"}, {text: collectedWords[2], color: "yellow"} ].map((w, i) => (
        <motion.span 
          key={i} 
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.3, duration: 0.5, type: "spring" }} 
          className={`text-[12px] font-extrabold px-5 py-2 rounded-full border shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md transition-colors`}
          style={{
            borderColor: w.color === "cyan" ? "rgba(34, 211, 236, 0.4)" : w.color === "magenta" ? "rgba(236, 72, 153, 0.4)" : "rgba(250, 204, 21, 0.4)",
            color: w.color === "cyan" ? "#22d3ee" : w.color === "magenta" ? "#ec4899" : "#facc15",
            backgroundColor: 'rgba(255,255,255,0.05)',
            boxShadow: `0 0 15px -3px ${w.color === "cyan" ? "rgba(34, 211, 236, 0.2)" : w.color === "magenta" ? "rgba(236, 72, 153, 0.2)" : "rgba(250, 204, 21, 0.2)"}`
          }}
        >
          {w.text}
        </motion.span>
      ))}
    </div>
  </motion.div>
)}
{/* === 4. RESULT SCREEN (แก้ไขปัญหาการซ้อนทับลายน้ำ ✨) === */}
{gameState === "result" && (
  <div className="flex-1 flex flex-col bg-stone-50 relative h-full overflow-hidden">
    
    {/* ✨ พื้นที่แคปเจอร์ภาพ (Glassmorphism & Polkadot Style) ✨ */}
    <div 
      ref={quoteCardRef} 
      className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6 relative bg-stone-50"
    >
      {/* ลายจุด Polkadot ฉากหลัง */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

      {/* Dynamic Background Glow - แสงออร่าตามสีอารมณ์ข้างหลัง */}
      <div 
        className="absolute inset-0 opacity-40 blur-[80px] pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at center, ${playerMood ? ({happy: "#facc15", sad: "#60a5fa", angry: "#ef4444", fear: "#a855f7", love: "#ec4899", lonely: "#78716c", hope: "#34d399", confused: "#818cf8", apathetic: "#94a3b8", exhausted: "#fb923c"})[playerMood.id] || "#3b82f6" : "#3b82f6"} 0%, transparent 60%)`
        }}
      ></div>

      {/* 💳 การ์ดคำคมแบบกระจกใส (Glass Card) */}
      <div 
        // 💡 แก้ไข: ปรับ pb-8 sm:pb-10 เป็น pb-6 sm:pb-8 (เนื่องจากลายน้ำไม่ได้เป็น absolute อีกต่อไป)
        // 💡 แก้ไข: เพิ่ม gap-8 เพื่อรองรับลายน้ำที่เพิ่มเข้ามาใน flex layout
        className="relative z-10 w-full max-w-[95%] bg-white/70 backdrop-blur-xl border-[3px] border-white rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] pt-12 pb-6 sm:pt-14 sm:pb-8 px-8 sm:px-10 flex flex-col items-center gap-8"
      >
        
        {/* ไอคอน Quote แต่งขอบ */}
        <div 
          className="absolute -top-5 left-8 bg-white p-3 rounded-full shadow-lg border-[3px] border-stone-100 rotate-[-10deg]"
        >
          <Quote size={28} className="text-stone-300" />
        </div>

        {/* ส่วนคำคม: สไตล์ Marker Highlight เน้นข้อความ */}
        <div className="w-full flex flex-col items-center gap-1.5 mt-2 px-1">
          {(finalQuote || "").replace(/\\n/g, '\n').split('\n').map((line, idx) => {
            if (!line.trim()) return null;
            return (
              <span 
                key={idx}
                className="text-[20px] sm:text-[24px] font-black leading-relaxed text-stone-900 tracking-tight text-center relative inline-block drop-shadow-sm max-w-full"
                style={{ wordBreak: 'break-word' }}
              >
                <span className="relative z-10 px-2 block">{line.trim()}</span>
                
                {/* ไฮไลท์สีด้านหลังข้อความ (ปรับให้จางลง ละมุนขึ้น) */}
                <span 
                  className="absolute bottom-1.5 left-0 w-full h-[35%] opacity-20 z-0 rounded-sm -rotate-1"
                  style={{
                    backgroundColor: playerMood ? ({happy: "#facc15", sad: "#60a5fa", angry: "#ef4444", fear: "#a855f7", love: "#ec4899", lonely: "#78716c", hope: "#34d399", confused: "#818cf8", apathetic: "#94a3b8", exhausted: "#fb923c"})[playerMood.id] || "#3b82f6" : "#3b82f6"
                  }}
                ></span>
              </span>
            );
          })}
        </div>

        {/* แท็กคำศัพท์: ดีไซน์แบบ Pill Button */}
        <div className="flex flex-wrap justify-center items-center gap-2.5">
          {collectedWords.map((w, i) => (
            <span 
              key={i} 
              className={`text-[12px] font-extrabold px-4 py-1.5 rounded-full border-[2px] bg-white shadow-sm whitespace-nowrap ${playerMood ? moodOptions.find(m => m.id === playerMood.id)?.theme.split(" ").filter(c => c.includes('text') || c.includes('border')).join(' ') : 'text-blue-600 border-blue-200'}`}
            >
              #{w}
            </span>
          ))}
        </div>

        {/* ลายน้ำแบรนด์ คมสัดสัด - ดีไซน์ Tag น่ารักๆ (ย้ายมาอยู่ภายใน flex layout) */}
        {/* 💡 แก้ไข: ย้ายมาวางไว้ที่นี่ และลบ 'absolute bottom-6 z-10' ออก, เพิ่ม mt-8 เพื่อสร้างช่องว่าง */}
        <div className="relative flex flex-col items-center gap-1.5 mt-8 w-full">
          <div className="text-[9px] font-black tracking-[0.3em] text-stone-800 uppercase drop-shadow-sm bg-white/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-white">
            KHOMSATSAT <span className="text-blue-600 mx-1">×</span> UPSKILL WITH FUII
          </div>
          <div className="text-[10px] font-bold tracking-widest text-stone-400">
            {timestamp}
          </div>
        </div>

      </div>

    </div>
    
    {/* === โซนปุ่มควบคุม (UI) === */}
    <div className="p-6 pb-8 bg-white border-t border-stone-200 flex flex-col gap-3 shrink-0 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
      
      <button 
        onClick={handleSaveImage}
        disabled={isSaving}
        className="w-full bg-stone-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-stone-900/20 flex items-center justify-center gap-2 text-[16px] hover:bg-stone-800 hover:scale-[1.02] active:scale-[0.97] transition-all disabled:opacity-50"
      >
        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        {isSaving ? "กำลังจัดเก็บความทรงจำ..." : "เซฟคำคมลงเครื่อง"}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={resetApp} 
          className="py-3.5 bg-stone-100 text-stone-600 font-bold rounded-xl text-[13px] flex items-center justify-center gap-2 hover:bg-stone-200 active:scale-95 transition-all border border-stone-200"
        >
          <RefreshCcw size={15}/> สุ่มใหม่
        </button>

        <a 
          href="https://lin.ee/rQawKUM" 
          target="_blank"
          rel="noopener noreferrer"
          className="py-3.5 bg-blue-600 text-white font-bold rounded-xl text-[13px] flex items-center justify-center gap-2 active:scale-95 hover:bg-blue-700 hover:scale-[1.02] shadow-lg shadow-blue-600/20 transition-all"
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