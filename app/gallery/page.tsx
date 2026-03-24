"use client";
import { useEffect, useState } from "react";
// 💡 1. Import limit, startAfter, where เพิ่มเติมเพื่อทำระบบโหลดทีละนิด
import { collection, getDocs, query, orderBy, doc, updateDoc, increment, limit, startAfter, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase"; 
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Quote, Loader2, Heart, Share2, CheckCircle, Download } from "lucide-react"; 
import Link from "next/link";
import { Kanit } from "next/font/google";
import { toPng } from "html-to-image"; 

const kanit = Kanit({ 
  subsets: ["thai", "latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"] 
});

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

// 💡 กำหนดจำนวนที่จะดึงมาในแต่ละรอบ (15 อันกำลังสวย เพราะลงตัวกับ Grid 3 คอลัมน์)
const FETCH_LIMIT = 15;

export default function GalleryPage() {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedQuotes, setLikedQuotes] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ทั้งหมด");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // 💡 2. State ใหม่สำหรับระบบ Load More
  const [lastDoc, setLastDoc] = useState<any>(null); // จำว่าโหลดถึงไหนแล้ว
  const [hasMore, setHasMore] = useState(true); // เช็คว่ามีข้อมูลเหลือให้โหลดอีกไหม
  const [loadingMore, setLoadingMore] = useState(false); // สถานะตอนกำลังกดปุ่มโหลดเพิ่ม

  // 💡 3. ฟังก์ชันโหลดข้อมูลครั้งแรก (หรือตอนเปลี่ยนหมวดหมู่)
  const fetchInitialQuotes = async () => {
    setLoading(true);
    try {
      let q;
      // ถ้าเลือกทั้งหมด ไม่ต้องใส่ where, แต่ถ้าเลือกหมวดอื่น ให้ filter จาก Database เลย
      if (activeFilter === "ทั้งหมด") {
        q = query(collection(db, "quotes"), orderBy("createdAt", "desc"), limit(FETCH_LIMIT));
      } else {
        q = query(collection(db, "quotes"), where("mood", "==", activeFilter), orderBy("createdAt", "desc"), limit(FETCH_LIMIT));
      }

      const querySnapshot = await getDocs(q);
      const data: QuoteData[] = [];
      querySnapshot.forEach((document) => {
        data.push({ id: document.id, ...document.data(), likes: document.data().likes || 0 } as QuoteData);
      });
      
      setQuotes(data);
      
      // อัปเดตตัวแปรสำหรับการโหลดครั้งต่อไป
      if (querySnapshot.docs.length > 0) {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === FETCH_LIMIT); // ถ้าดึงมาได้ครบ 15 แปลว่าน่าจะมีต่อ
      } else {
        setLastDoc(null);
        setHasMore(false); // ข้อมูลหมดแล้ว
      }
    } catch (error) {
      console.error("Error fetching initial quotes: ", error);
      // ⚠️ คำเตือน: ถ้าเปิดคอนโซลแล้วเจอ Error เรื่อง Firebase Index ให้คลิกลิงก์ใน Error นั้นเพื่อสร้าง Index นะครับ
    } finally {
      setLoading(false);
    }
  };

  // 💡 4. ฟังก์ชันโหลดข้อมูลเพิ่มเติม (Load More)
  const loadMoreQuotes = async () => {
    if (!lastDoc || loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      let q;
      if (activeFilter === "ทั้งหมด") {
        q = query(collection(db, "quotes"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(FETCH_LIMIT));
      } else {
        q = query(collection(db, "quotes"), where("mood", "==", activeFilter), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(FETCH_LIMIT));
      }

      const querySnapshot = await getDocs(q);
      const data: QuoteData[] = [];
      querySnapshot.forEach((document) => {
        data.push({ id: document.id, ...document.data(), likes: document.data().likes || 0 } as QuoteData);
      });
      
      // เอาของใหม่ไปต่อท้ายของเก่า
      setQuotes(prev => [...prev, ...data]);
      
      if (querySnapshot.docs.length > 0) {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === FETCH_LIMIT);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more quotes: ", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // 💡 5. ดึงข้อมูลใหม่ทุกครั้งที่ State activeFilter เปลี่ยน
  useEffect(() => {
    fetchInitialQuotes();
    
    // โหลดประวัติการกดไลก์จากเครื่อง (ทำครั้งเดียว)
    const savedLikes = localStorage.getItem("khomsatsat_likes");
    if (savedLikes) setLikedQuotes(JSON.parse(savedLikes));
  }, [activeFilter]);

  // ระบบ Like
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
      await updateDoc(quoteRef, { likes: isLiked ? increment(-1) : increment(1) });
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  // ระบบ Share Text
  const handleShare = async (item: QuoteData) => {
    const textToShare = `"${item.quote.replace(/\\n/g, '\n')}"\n\nอารมณ์: ${item.mood}\n#${item.words.join(" #")}\n\nสร้างคำคมของคุณได้ที่: ${window.location.origin}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'คมสัดสัด x Upskill with Fuii', text: textToShare }); } catch (error) {}
    } else {
      navigator.clipboard.writeText(textToShare);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // ระบบ Download รูปภาพ
  const handleDownloadImage = async (quoteId: string) => {
    try {
      setDownloadingId(quoteId);
      const element = document.getElementById(`quote-card-${quoteId}`);
      if (!element) return;
      const dataUrl = await toPng(element, { 
        quality: 1.0, pixelRatio: 3,
        style: { backgroundColor: '#1c1917', transform: 'scale(1)', borderRadius: '2rem' },
        filter: (node) => {
          if (node instanceof HTMLElement && node.getAttribute('data-html2canvas-ignore') === 'true') return false;
          return true;
        }
      });
      const link = document.createElement('a');
      link.download = `khomsatsat-${quoteId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error saving image:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className={`min-h-[100dvh] bg-stone-950 text-stone-100 ${kanit.className} overflow-x-hidden relative flex flex-col`}>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-stone-950 to-stone-950 pointer-events-none -z-10"></div>

      <header className="pt-12 pb-4 flex flex-col items-center relative z-20 bg-stone-950/80 backdrop-blur-xl sticky top-0 border-b border-white/5">
        <div className="px-6 w-full flex items-center justify-center relative mb-4">
          <Link href="/" className="absolute left-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight drop-shadow-md">แกลเลอรี<span className="text-blue-500">ทัชใจ</span></h1>
            <p className="text-[12px] text-stone-400 mt-0.5 font-medium tracking-wide">ร้อยเรียงความรู้สึกที่ถูกกลั่นกรอง</p>
          </div>
        </div>

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

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <main className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full flex flex-col items-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50 w-full">
            <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
            <p className="text-sm font-bold tracking-widest uppercase">Loading...</p>
          </div>
        ) : quotes.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center w-full">
            <span className="text-5xl mb-4 grayscale opacity-50">🍃</span>
            <p className="text-stone-400 font-medium">ยังไม่มีคำคมในหมวดหมู่นี้</p>
            <Link href="/" className="mt-4 text-blue-500 text-sm font-bold hover:underline">
              ไปสร้างคำคมแรกกันเลย!
            </Link>
          </motion.div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* 💡 เปลี่ยนเป้าหมาย map จาก filteredQuotes เป็น quotes ตรงๆ ได้เลย */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              <AnimatePresence mode="popLayout">
                {quotes.map((item, index) => {
                  const hasLiked = likedQuotes.includes(item.id);
                  const isCopied = copiedId === item.id;
                  
                  return (
                    <motion.div 
                      layout
                      id={`quote-card-${item.id}`} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ delay: (index % FETCH_LIMIT) * 0.05 }}
                      key={item.id} 
                      className="bg-stone-900/80 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 relative flex flex-col shadow-xl hover:border-blue-500/30 transition-colors group"
                    >
                      <Quote size={24} className="text-stone-700 absolute top-6 left-6 -rotate-12 group-hover:text-blue-500/30 transition-colors" />
                      
                      <div className="absolute bottom-8 right-8 text-[8px] font-black uppercase tracking-[0.2em] text-stone-500/30 text-right pointer-events-none z-0">
                        Khomsatsat <br/><span className="text-blue-500/50">x Upskill with Fuii</span>
                      </div>
                      

                      <div className="flex justify-end mb-4 relative z-10" data-html2canvas-ignore="true">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full text-stone-400 border border-white/5 flex items-center gap-1.5 backdrop-blur-md">
                          {moodCategories.find(m => m.title === item.mood)?.icon} {item.mood || "ไม่ระบุอารมณ์"}
                        </span>
                      </div>

                      <p className="text-[16px] font-bold leading-[1.8] text-stone-200 whitespace-pre-line my-4 grow relative z-10">
                        {item.quote.replace(/\\n/g, '\n')}
                      </p>

                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5 relative z-10">
                        <div className="flex flex-wrap gap-2">
                          {item.words?.map((word, wIdx) => (
                            <span key={wIdx} className="text-[10px] font-bold text-blue-400/80 bg-blue-500/10 px-2.5 py-1 rounded-md">
                              #{word}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2" data-html2canvas-ignore="true">
                          <button 
                            onClick={() => handleDownloadImage(item.id)}
                            disabled={downloadingId === item.id}
                            className="p-2 rounded-full transition-all bg-white/5 text-stone-400 hover:text-white hover:bg-white/20 active:scale-90 disabled:opacity-50"
                          >
                            {downloadingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                          </button>
                          <button 
                            onClick={() => handleShare(item)}
                            className={`p-2 rounded-full transition-all active:scale-90 ${isCopied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-stone-400 hover:text-blue-400 hover:bg-white/10'}`}
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

            {/* 💡 6. ปุ่ม Load More จะโชว์ก็ต่อเมื่อมีข้อมูลเหลือ */}
            {hasMore && (
              <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={loadMoreQuotes}
                disabled={loadingMore}
                className="mt-12 px-8 py-3 bg-stone-900 border border-white/10 text-stone-300 font-bold rounded-full text-[13px] hover:bg-stone-800 hover:text-white active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loadingMore ? (
                  <><Loader2 size={16} className="animate-spin text-blue-500" /> กำลังโหลดเพิ่ม...</>
                ) : (
                  "โหลดคำคมเพิ่มเติม"
                )}
              </motion.button>
            )}

          </div>
        )}
      </main>

      <footer className="w-full py-10 mt-auto border-t border-white/5 flex flex-col items-center justify-center relative z-10 bg-stone-950/50 backdrop-blur-md">
        <p className="text-[10px] text-stone-500 font-black uppercase tracking-[0.3em] drop-shadow-sm">
          Khomsatsat <span className="text-blue-500/60 mx-1">×</span> Upskill with Fuii
        </p>
        <p className="text-[9px] text-stone-600 font-medium tracking-wider mt-2">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  );
}