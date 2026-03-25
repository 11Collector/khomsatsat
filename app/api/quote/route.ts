import { NextResponse } from 'next/server';
// 💡 Import ฐานข้อมูลของเรา และคำสั่ง addDoc, collection ของ Firebase
import { db } from '@/app/lib/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let mood = "";
  let words: string[] = ["ความรู้สึก", "หนทาง"]; 

  try {
    const body = await req.json();
    mood = body.mood;
    words = body.words;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("ลืมใส่ GEMINI_API_KEY ในไฟล์ .env.local หรือเปล่า?");
    }

    const prompt = `
      คุณคือนักเขียนคำคมมือฉมัง สไตล์ปรัชญาชีวิต Mindset การเติบโต และความก้าวหน้า (สไตล์ 'คมสัดสัด' และเพจ 'Upskill with Fuii' ที่กระแทกใจวัยรุ่นและคนทำงาน)
      ผู้ใช้กำลังรู้สึก: "${mood}"
      และเลือกคำสะท้อนความรู้สึกคือ: "${words.join('", "')}"

      จงแต่งคำคม 1 บท สั้นๆ กระชับ ทรงพลัง ลึกซึ้ง (ความยาว 4-6 บรรทัดเท่านั้น)
      
      🚨 กฎเหล็กในการตัดขึ้นบรรทัดใหม่ (\\n) เพื่อทำ Typography Art แบบภาษาไทย (ห้ามฝ่าฝืน):
      1. ต้องตัดตาม "วลี" หรือ "จังหวะการหายใจ" ห้ามตัดกลางคำศัพท์เด็ดขาด!
      2. บรรทัดนึงอย่าให้ยาวเกินไป (ประมาณ 3-5 คำต่อบรรทัด) เพื่อไม่ให้ล้นหน้าจอมือถือ
      3. ข้อความที่อยู่ในเครื่องหมายอัญประกาศ "..." ต้องอยู่ในบรรทัดเดียวกันเสมอ ห้ามแยกบรรทัด!
      4. ห้ามทิ้งคำสั้นๆ โดดๆ (เช่น คน, กัน, ไป, ขึ้น, ลง, มือ) ไว้บรรทัดใหม่บรรทัดเดียวเด็ดขาด ให้เอามารวมกับบรรทัดก่อนหน้า
      5. ความยาวรวมต้องสั้นมากๆ (ห้ามเกิน 30-35 คำรวมทั้งบท) ไม่เยิ่นเย้อ
      6. ห้ามพิมพ์คำอธิบายหรือเกริ่นนำใดๆ พิมพ์แค่ "ตัวคำคม" เท่านั้น

      ตัวอย่างที่ผิด ❌ (ตัดคำขาด, ทิ้งคำโดด, แยกเครื่องหมายคำพูด):
      การมอง "ดวงดาว" ร่วม
      กัน
      จะไม่มีความหมาย
      หากปราศจากการ "จับ
      มือ"

      ตัวอย่างที่ถูกต้องแบบที่ 1 ✅ (ตัดตามวลี, จัดกลุ่มคำสวยงาม, จังหวะอ่านสมูท):
      การมอง "ดวงดาว" ร่วมกัน
      จะไม่มีความหมายเลย
      หากปราศจากการ "จับมือ"
      ความ "ห่วงใย" ที่แท้จริง
      คือแรงผลักดันให้เราเก่งขึ้น
      เพื่อใครบางคน

      ตัวอย่างที่ถูกต้องแบบที่ 2 ✅ (สั้น กระชับ ทรงพลังแบบจบปิ๊ง):
      ความล้มเหลวในวันนี้
      คือจิ๊กซอว์ชิ้นสำคัญ
      ที่กำลังประกอบภาพ...
      ความสำเร็จในวันหน้า
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey 
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const text = data.candidates[0].content.parts[0].text.trim();

    // 💡 --- จุดเซฟข้อมูลลง FIREBASE ที่เพิ่มเข้ามา --- 💡
    try {
      await addDoc(collection(db, "quotes"), {
        mood: mood,               // อารมณ์ที่เลือก
        words: words,             // คำ 3 คำที่สะสมมา
        quote: text,              // คำคมที่ AI แต่งให้
        createdAt: serverTimestamp() // เวลาที่สร้าง (ดึงจากเวลา Server ของ Firebase)
      });
      console.log("✅ บันทึกคำคมลง DB สำเร็จ!");
    } catch (dbError) {
      // ใส่ Try-Catch ตรงนี้ไว้ เผื่อ DB พัง หรือเซ็ตอัพผิด แอปหน้าบ้านจะได้ไม่แครชครับ
      console.error("❌ บันทึก DB พลาด แต่ปล่อยผ่านให้แอปทำงานต่อได้:", dbError);
    }
    // 💡 -------------------------------------------

    return NextResponse.json({ quote: text });
    
  } catch (error: any) {
    console.log("========== 🚨 NATIVE FETCH ERROR 🚨 ==========");
    console.error(error);
    console.log("==============================================");

    const errorMessage = error?.message || "Unknown Error";
    
    return NextResponse.json(
      { quote: `(พังเพราะ: ${errorMessage})\n\nท่ามกลางความรู้สึก "${words[0]}"...\nจงใช้ "${words[1]}" เป็นคำตอบของวันนี้` },
      { status: 500 }
    );
  }
}