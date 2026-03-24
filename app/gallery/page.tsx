"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/app/lib/firebase"; 
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Quote, Loader2, Heart, Share2, CheckCircle } from "lucide-react"; 
import Link from "next/link";
import { Kanit } from "next/font/google";

const kanit = Kanit({ 
  subsets: ["thai", "latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"] 
});

// 💡 1. เอา Data อารมณ์มาใส่ในหน้านี้ด้วย เพื่อใช้ทำปุ่ม Filter
const moodCategories = [
  { id: "all", icon: "🌈", title: "ทั้งหมด" },
  { id: "happy", icon: "😊", title: "มีความสุข" },
  { id: "sad", icon: "😢", title: "เศร้าหมอง" },
  { id: "angry", icon: "😡", title: "โกรธมาก" },
  { id: "fear", icon: "😨", title: "หวาดกลัว" },
  { id: "love", icon: "❤️", title: "คลั่งรัก" },
  { id: "lonely", icon: "🍂", title: "โดดเดี่ยว" },
  { id: "hope", icon: "✨", title: "เปี่ยมหวัง" },
  { id: "confused", icon: "🌀", title: "สับสน" },
  { id: "apathetic", icon: "😐", title: "เฉยเมย" },
  { id: "exhausted", icon: "🫠", title: "เหนื่อยล้า" }
];

interface QuoteData {
  id: string;
  mood: string;
  words: string[];
  quote: string;
  createdAt: any;
  likes?: number;
}

export default function GalleryPage() {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedQuotes, setLikedQuotes] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // 💡 2. State สำหรับเก็บว่าตอนนี้เลือกหมวดหมู่อะไรอยู่ (ค่าเริ่มต้นคือ "ทั้งหมด")
  const [activeFilter, setActiveFilter] = useState<string>("ทั้งหมด");

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const data: QuoteData[] = [];
        querySnapshot.forEach((document) => {
          data.push({ id: document.id, ...document.data(), likes: document.data().likes || 0 } as QuoteData);
        });
        
        setQuotes(data);
      } catch (error) {
        console.error("Error fetching quotes: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();

    const savedLikes = localStorage.getItem("khomsatsat_likes");
    if (savedLikes) {
      setLikedQuotes(JSON.parse(savedLikes));
    }
  }, []);

  const handleLike = async (quoteId: string) => {
    const isLiked = likedQuotes.includes(quoteId);
    let newLikedQuotes;
    if (isLiked) {
      newLikedQuotes = likedQuotes.filter(id => id !== quoteId);
      setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, likes: Math.max(0, (q.likes || 0) - 1) } : q));
    } else {
      newLikedQuotes = [...likedQuotes, quoteId];
      setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, likes: (q.likes || 0) + 1 } : q));
    }
    setLikedQuotes(newLikedQuotes);
    localStorage.setItem("khomsatsat_likes", JSON.stringify(newLikedQuotes));

    try {
      const quoteRef = doc(db, "quotes", quoteId);
      await updateDoc(quoteRef, {
        likes: isLiked ? increment(-1) : increment(1)
      });
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleShare = async (item: QuoteData) => {
    const textToShare = `"${item.quote.replace(/\\n/g, '\n')}"\n\nอารมณ์: ${item.mood}\n#${item.words.join(" #")}\n\nสร้างคำคมของคุณได้ที่: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'คมสัดสัด x Upskill with Fuii',
          text: textToShare,
        });
      } catch (error) {
        console.log('User cancelled sharing or error:', error);
      }
    } else {
      navigator.clipboard.writeText(textToShare);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // 💡 3. กรองคำคมตามหมวดหมู่ที่เลือก (ถ้าเลือก "ทั้งหมด" ก็โชว์หมด)
  const filteredQuotes = activeFilter === "ทั้งหมด" 
    ? quotes 
    : quotes.filter(q => q.mood === activeFilter);

  return (
    <div className={`min-h-[100dvh] bg-stone-950 text-stone-100 ${kanit.className} overflow-x-hidden relative`}>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-stone-950 to-stone-950 pointer-events-none -z-10"></div>

      <header className="pt-12 pb-4 flex flex-col items-center relative z-20 bg-stone-950/80 backdrop-blur-xl sticky top-0 border-b border-white/5">
        <div className="px-6 w-full flex items-center justify-center relative mb-4">
          <Link href="/" className="absolute left-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight drop-shadow-md">แกลเลอรี<span className="text-blue-500">ทัชใจ</span></h1>
            <p className="text-[12px] text-stone-400 mt-0.5 font-medium tracking-wide">รวมร้อยความรู้สึกที่ถูกกลั่นกรอง</p>
          </div>
        </div>

        {/* 💡 4. แถบปุ่ม Filter หมวดหมู่อารมณ์ (เลื่อนซ้ายขวาได้) */}
        <div className="w-full overflow-x-auto pb-4 pt-2 hide-scrollbar">
          <div className="flex px-6 gap-2 w-max mx-auto">
            {moodCategories.map((cat) => {
              const isActive = activeFilter === cat.title;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.title)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all active:scale-95 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-500' 
                      : 'bg-stone-900 text-stone-400 border border-white/10 hover:bg-stone-800 hover:text-stone-200'
                  }`}
                >
                  <span className="text-[14px]">{cat.icon}</span>
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 💡 เพิ่ม CSS เพื่อซ่อน Scrollbar ของแถบ Filter แต่ยังเลื่อนได้ */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
            <p className="text-sm font-bold tracking-widest uppercase">Loading...</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          // 💡 กรณีที่กดหมวดไหนแล้วยังไม่มีคนสร้างคำคมในหมวดนั้น
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4 grayscale opacity-50">🍃</span>
            <p className="text-stone-400 font-medium">ยังไม่มีคำคมในหมวดหมู่นี้</p>
            <Link href="/" className="mt-4 text-blue-500 text-sm font-bold hover:underline">
              ไปสร้างคำคมแรกกันเลย!
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredQuotes.map((item, index) => {
                const hasLiked = likedQuotes.includes(item.id);
                const isCopied = copiedId === item.id;
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    key={item.id} 
                    className="bg-stone-900/80 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 relative flex flex-col shadow-xl hover:border-blue-500/30 transition-colors group"
                  >
                    <Quote size={24} className="text-stone-700 absolute top-6 left-6 -rotate-12 group-hover:text-blue-500/30 transition-colors" />
                    
                    <div className="flex justify-end mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full text-stone-400 border border-white/5 flex items-center gap-1.5">
                        {/* ดึงไอคอนมาโชว์ที่การ์ดด้วย */}
                        {moodCategories.find(m => m.title === item.mood)?.icon} {item.mood || "ไม่ระบุอารมณ์"}
                      </span>
                    </div>

                    <p className="text-[16px] font-bold leading-[1.8] text-stone-200 whitespace-pre-line my-4 grow">
                      {item.quote.replace(/\\n/g, '\n')}
                    </p>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                      <div className="flex flex-wrap gap-2">
                        {item.words?.map((word, wIdx) => (
                          <span key={wIdx} className="text-[10px] font-bold text-blue-400/80 bg-blue-500/10 px-2.5 py-1 rounded-md">
                            #{word}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleShare(item)}
                          className={`p-2 rounded-full transition-all active:scale-90 ${isCopied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-stone-400 hover:text-blue-400 hover:bg-white/10'}`}
                          title="แชร์คำคมนี้"
                        >
                          {isCopied ? <CheckCircle size={16} /> : <Share2 size={16} />}
                        </button>

                        <button 
                          onClick={() => handleLike(item.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-90 ${hasLiked ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-stone-400 hover:text-red-400 hover:bg-white/10'}`}
                        >
                          <Heart size={16} className={hasLiked ? "fill-current" : ""} />
                          <span className="text-[12px] font-bold">{item.likes || 0}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}