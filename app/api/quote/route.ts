import { NextResponse } from 'next/server';

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

   // ... โค้ดส่วนอื่นๆ ...

    const prompt = `
      คุณคือนักเขียนคำคมมือฉมัง สไตล์ปรัชญาชีวิตและการเติบโต (สไตล์ 'คมสัดสัด')
      ผู้ใช้กำลังรู้สึก: "${mood}"
      และเลือกคำสะท้อนความรู้สึกคือ: "${words.join('", "')}"

      จงแต่งคำคม 1 ประโยค ความยาวไม่เกิน 2-3 บรรทัด
      เงื่อนไขสำคัญ:
      1. ต้องลึกซึ้ง กระแทกใจ ให้ข้อคิด
      2. ใช้ภาษาพูดที่สละสลวย
      3. **สำคัญมาก**: ให้ใส่เครื่องหมายขึ้นบรรทัดใหม่ (\\n) ในจุดที่ควรเว้นวรรคเพื่อให้อ่านลื่นที่สุด 
         ห้ามปล่อยให้คำถูกตัดกลางคำ (เช่น ห้ามตัดระหว่าง ท่า...มกลาง)
      4. ห้ามพิมพ์คำอธิบาย พิมพ์แค่ "ตัวคำคม" เท่านั้น
    `;

    // 🚀 ใช้ URL และส่ง Key ผ่าน Header แบบเดียวกับ cURL ของคุณฟุ้ยเป๊ะๆ!
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey // ส่ง Key ตรงนี้ตาม cURL เลย
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

    // เจาะเอาข้อความที่ AI ตอบกลับมา
    const text = data.candidates[0].content.parts[0].text.trim();

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