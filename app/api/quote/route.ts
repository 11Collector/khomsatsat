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

    // 💡 ปรับ Prompt ใหม่ทั้งหมดเพื่อบังคับ Algorithm การตัดคำให้สั้นและกระชับมากๆ (สไตล์ 'คมสัดสัด')
 // 💡 ปรับ Prompt ใหม่: เน้นความสั้น กระชับ และเปลี่ยนตัวอย่างให้ไม่เกิน 5 บรรทัด
    const prompt = `
      คุณคือนักเขียนคำคมมือฉมัง สไตล์ปรัชญาชีวิต การเติบโต และความก้าวหน้า (สไตล์ 'คมสัดสัด' และ 'Upskill with Fuii')
      ผู้ใช้กำลังรู้สึก: "${mood}"
      และเลือกคำสะท้อนความรู้สึกคือ: "${words.join('", "')}"

      จงแต่งคำคม 1 บท สั้นๆ กระชับ **ความยาว 5-7 บรรทัดเท่านั้น** (สไตล์ Typography Art)
      เงื่อนไขสำคัญ (Algorithm การตัดคำ):
      1. ต้องลึกซึ้ง กระแทกใจ ให้ข้อคิดสะกิดใจแบบเฉียบขาด
      2. ความยาวรวมต้องสั้นมากๆ (ห้ามเกิน 30-35 คำรวมทั้งบท) ทรงพลัง ไม่เยิ่นเย้อ
      3. ต้องขึ้นบรรทัดใหม่ (\\n) ตามจังหวะการอ่าน บรรทัดละประมาณ 3-5 คำ 
      4. **ห้ามแต่งเกิน 5 บรรทัดเด็ดขาด**
      5. ห้ามตัดกลางคำ ให้ตัดตามจังหวะความหมายให้ดูเหมือนบทกวี
      6. ห้ามพิมพ์คำอธิบาย พิมพ์แค่ "ตัวคำคม" เท่านั้น

      ตัวอย่างการจัดหน้าและตัดบรรทัดที่ถูกต้อง (สั้น กระชับ 4 บรรทัด):
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