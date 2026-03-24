"use client";
import { useState, useEffect, useRef } from "react"; 
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ChevronLeft, X, Check, RefreshCcw, Quote, Download, Loader2, SubscriptIcon, Heart } from "lucide-react"; 
import { Kanit } from "next/font/google";
import { toPng } from 'html-to-image'; 

const kanit = Kanit({ 
  subsets: ["thai", "latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"] 
});

// --- 1. DATA: Mood Check (8 อารมณ์พื้นฐาน) ---
const moodOptions = [
  { id: "happy", icon: "😊", title: "มีความสุข", theme: "border-yellow-400 bg-yellow-50 text-yellow-600" },
  { id: "sad", icon: "😢", title: "เศร้าหมอง", theme: "border-blue-400 bg-blue-50 text-blue-600" },
  { id: "angry", icon: "😡", title: "โกรธมาก", theme: "border-red-500 bg-red-50 text-red-600" },
  { id: "fear", icon: "😨", title: "หวาดกลัว", theme: "border-purple-500 bg-purple-50 text-purple-600" },
  { id: "love", icon: "❤️", title: "คลั่งรัก", theme: "border-pink-500 bg-pink-50 text-pink-600" },
  { id: "lonely", icon: "🍂", title: "โดดเดี่ยว", theme: "border-stone-500 bg-stone-50 text-stone-600" },
  { id: "hope", icon: "✨", title: "เปี่ยมหวัง", theme: "border-emerald-400 bg-emerald-50 text-emerald-600" },
  { id: "confused", icon: "🌀", title: "สับสน", theme: "border-indigo-400 bg-indigo-50 text-indigo-600" }
];

// --- 2. DATA: คำนามธรรม (30 คำ) ---
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
  ]
};

// --- 3. พิกัดปลอดภัย (Safe Zones) ---
const safePositions = [
  "top-[0px] left-[5px]",       
  "top-[25px] right-[5px]",     
  "top-[135px] left-[115px]",   
  "top-[250px] left-[5px]",     
  "top-[195px] right-[0px]",    
  "top-[380px] left-[15px]",    
  "top-[330px] right-[10px]",   
  "top-[480px] left-[115px]"    
];

const floatingAnimation = (delay: number): any => ({
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    ease: "easeInOut",
    repeat: Infinity,
    delay: delay
  }
});

// --- Helper Component สำหรับ Bubble ---
const Circle = ({ mood, pos, delay, onStart }: any) => {
  const getBorderColor = (id: string) => {
    const colors: Record<string, string> = {
      happy: "#facc15",    
      sad: "#60a5fa",      
      angry: "#ef4444",    
      fear: "#a855f7",     
      love: "#ec4899",     
      lonely: "#78716c",   
      hope: "#34d399",     
      confused: "#818cf8"  
    };
    return colors[id] || "#e5e7eb";
  };

  return (
    <motion.button 
      animate={floatingAnimation(delay)}
      onClick={() => onStart(mood)}
      className={`absolute ${pos} w-[110px] h-[110px] rounded-full border-[2.5px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-1 active:scale-95 transition-all bg-white shrink-0 z-20 hover:shadow-md`}
      style={{ borderColor: getBorderColor(mood.id) }}
    >
      <span className="text-4xl mb-0.5">{mood.icon}</span>
      <span className="font-extrabold text-[12px] text-stone-700 tracking-tighter text-center px-1 leading-none">{mood.title}</span>
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

  useEffect(() => {
    const shuffled = [...moodOptions].sort(() => Math.random() - 0.5);
    setRandomizedMoods(shuffled);
    setIsMounted(true);
  }, []);

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
    // เซฟไทป์คีย์เวิร์ดให้ถูกต้อง
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

  // ✨ ฟังก์ชันสำหรับดึงสีขอบและสีข้อความออกมาอย่างปลอดภัย ป้องกันบั๊ก Undefined ✨
  const getActiveThemeClasses = () => {
    if (!playerMood) return "border-stone-500 text-stone-400"; // ค่าเริ่มต้นกันพัง
    const currentMoodInfo = moodOptions.find(m => m.id === playerMood.id);
    if (!currentMoodInfo) return "border-stone-500 text-stone-400";
    
    // แกะเอาเฉพาะ border และ text ออกมาจากธีม เช่น "border-yellow-400 bg-yellow-50 text-yellow-600"
    const classes = currentMoodInfo.theme.split(" ");
    return `${classes[0]} ${classes[2]}`; // ส่งกลับ border-... และ text-...
  };

  return (
    <div className={`min-h-[100dvh] bg-stone-100 flex flex-col items-center justify-center sm:p-4 ${kanit.className} overflow-hidden`}>
      <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden h-[100dvh] sm:h-[850px] flex flex-col relative sm:rounded-[2.5rem] sm:border-[4px] sm:border-stone-900">
        
        {/* === 1. START SCREEN === */}
        {gameState === "start" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center p-6 text-center relative bg-white h-full w-full overflow-hidden">
            <div className="mt-8 mb-4 z-30 pointer-events-none">
              <h1 className="text-5xl font-black mb-1 leading-tight tracking-tighter text-stone-900">
                {"คมสัด"}<span className="text-blue-600">สัด</span>
              </h1>
              <p className="text-stone-400 text-[13px] font-medium tracking-wide px-1">
                เลือกสิ่งที่ "ทัช" ในใจ ให้เป็นคำคมเฉพาะคุณ
              </p>
            </div>
            
            <div className="w-full max-w-[340px] h-[600px] relative mx-auto z-20 mt-2 transition-opacity duration-500" style={{ opacity: isMounted ? 1 : 0 }}>
              {isMounted && randomizedMoods.map((mood, index) => (
                <Circle key={mood.id} mood={mood} pos={safePositions[index]} delay={index * 0.4} onStart={startGame} />
              ))}
            </div>

            <p className="text-[9px] text-stone-300 mt-auto font-black uppercase tracking-[0.2em] relative z-30 pb-4">
              Khomsatsat x Upskill with Fuii
            </p>
          </motion.div>
        )}

        {/* === 2. SWIPING SCREEN === */}
        {gameState === "swiping" && deck.length > 0 && (
          <div className="flex-1 flex flex-col bg-stone-50 relative overflow-hidden h-full">
            <div className="pt-12 pb-6 px-6 bg-white border-b border-stone-200 flex flex-col items-center justify-center z-10 shadow-sm relative">
              <button onClick={resetApp} className="absolute left-6 top-14 p-2 bg-stone-100 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"><ChevronLeft size={20} /></button>
              <h2 className="text-[13px] font-bold text-stone-400 uppercase tracking-widest mb-3">สะสมคำที่ทัชใจ</h2>
              <div className="flex gap-2">
                {[0, 1, 2].map(slot => (
                  <div key={slot} className={`w-16 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${collectedWords[slot] ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-stone-100 border-stone-200 text-transparent'}`}>
                    {collectedWords[slot] || "?"}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative w-full px-6">
              <AnimatePresence>
                <motion.div
                  key={currentCardIndex}
                  style={{ x, rotate, scale: cardScale }}
                  drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleDragEnd}
                  initial={{ scale: 0.8, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.15 } }}
                  className="absolute w-full max-w-[300px] aspect-square bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.08)] border-[6px] border-stone-100 flex flex-col items-center justify-center p-8 cursor-grab active:cursor-grabbing z-20"
                >
                  <motion.div style={{ opacity: opacityNope }} className="absolute top-10 right-0 border-[4px] border-stone-400 text-stone-400 font-black text-2xl px-4 py-1 rounded-2xl rotate-[20deg] pointer-events-none z-30 uppercase">ข้าม</motion.div>
                  <motion.div style={{ opacity: opacityLike }} className="absolute top-10 left-0 border-[4px] border-blue-600 text-blue-600 font-black text-2xl px-4 py-1 rounded-2xl -rotate-[20deg] pointer-events-none z-30 uppercase">เอาคำนี้</motion.div>
                  <h3 className="text-[36px] font-black text-stone-800 text-center leading-tight tracking-tight">
                    {deck[currentCardIndex]}
                  </h3>
                </motion.div>
              </AnimatePresence>
              <div className="absolute w-full max-w-[300px] aspect-square bg-white rounded-full shadow-sm border-[6px] border-stone-100 -z-10 scale-[0.90] translate-y-6"></div>
            </div>

            <div className="pb-12 pt-4 flex justify-between items-center w-full px-16 text-[13px] font-bold tracking-widest text-stone-400 relative z-20">
              <span className="flex flex-col items-center gap-1 text-stone-400"><X size={24}/> ไม่รู้สึก</span>
              <span className="flex flex-col items-center gap-1 text-blue-600"><Check size={24}/> ทัชใจ</span>
            </div>
          </div>
        )}

        {/* === 3. GENERATING === */}
        {gameState === "generating" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-stone-900 relative">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-6 relative z-10" />
            <h2 className="text-2xl font-black text-white mb-2 relative z-10">หลอมรวมความรู้สึก...</h2>
            <div className="flex gap-2 justify-center mt-4 relative z-10">
              {collectedWords.map((w, i) => (
                <span key={i} className="text-[12px] bg-white/10 text-stone-300 px-3 py-1 rounded-full border border-white/20">{w}</span>
              ))}
            </div>
          </motion.div>
        )}
{/* === 4. RESULT SCREEN (เวอร์ชันแก้บั๊ก \n และคำล้น) === */}
{gameState === "result" && (
  <div className="flex-1 flex flex-col bg-stone-900 relative h-full overflow-hidden">
    
    {/* ✨ พื้นที่แคปเจอร์ภาพ (จัด Composition ใหม่) ✨ */}
    <div 
      ref={quoteCardRef} 
      className="flex-1 flex flex-col items-center justify-center text-center p-10 relative bg-stone-900"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #262626 0%, #1c1917 100%)'
      }}
    >
      {/* Quote Icon */}
      <Quote size={32} className="text-blue-500/30 absolute top-12 left-10 -rotate-12" />

      <div className="relative z-10 w-full flex flex-col items-center gap-10">
        
        {/* ส่วนคำคม: จัดจังหวะการอ่านใหม่ */}
        <div className="w-full max-w-[95%] px-2">
          <p 
            className="text-[26px] sm:text-[32px] font-bold leading-[1.7] text-stone-100 tracking-tight whitespace-pre-line break-words"
            style={{ 
              textWrap: 'balance',
              // ✨ ไฮไลต์แบบใหม่: ปรับให้ดูเหมือนขีดปากกา Marker จริงๆ ✨
              backgroundImage: 'linear-gradient(180deg, transparent 65%, rgba(37, 99, 235, 0.3) 65%)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%',
              display: 'inline',
              padding: '2px 0',
              boxDecorationBreak: 'clone',
              WebkitBoxDecorationBreak: 'clone',
            }}
          >
            {/* 🚨 จุดตาย: ต้องใส่ .replaceAll เพื่อแปลง \n เป็นการขึ้นบรรทัดใหม่จริงๆ 🚨 */}
            {finalQuote.replaceAll("\\n", "\n")}
          </p>
        </div>

        {/* จุดคั่นกลางมินิมอล */}
        <div className="flex gap-1.5 opacity-20">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-stone-500"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-stone-500"></div>
        </div>

        {/* แท็กคำศัพท์: แก้ปัญหาคำแยกบรรทัด (เช่น เข็ม-นาฬิกา) */}
        <div className="flex flex-wrap justify-center items-center gap-2.5">
          {collectedWords.map((w, i) => (
            <span 
              key={i} 
              className={`text-[11px] font-bold px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg whitespace-nowrap ${getActiveThemeClasses()}`}
            >
              # {w}
            </span>
          ))}
        </div>
      </div>

      {/* ลายน้ำแบรนด์ คมสัดสัด */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-30">
        <div className="text-[9px] font-black tracking-[0.4em] text-stone-500 uppercase">
          KHOMSATSAT <span className="text-blue-500/50">×</span> UPSKILL WITH FUII
        </div>
      </div>
    </div>
    
    {/* === โซนปุ่มควบคุม (UI) === */}
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
          className="py-3.5 bg-stone-800 text-stone-400 font-bold rounded-xl text-[13px] flex items-center justify-center gap-2 hover:bg-stone-700"
        >
          <RefreshCcw size={15}/> สุ่มใหม่
        </button>

        <a 
          href="https://lin.ee/rQawKUM" 
          target="_blank"
          rel="noopener noreferrer"
          className="py-3.5 bg-blue-600 text-white font-bold rounded-xl text-[13px] flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-900/20"
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