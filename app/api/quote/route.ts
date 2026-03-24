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

    // 💡 ปรับ Prompt ใหม่ทั้งหมดเพื่อบังคับ Algorithm การตัดคำให้สั้นและกระชับมากๆ (สไตล์ 'คมสัดสัด')
    const prompt = `
      คุณคือนักเขียนคำคมมือฉมัง สไตล์ปรัชญาชีวิตและการเติบโต (สไตล์ 'คมสัดสัด' และ 'Upskill with Fuii')
      ผู้ใช้กำลังรู้สึก: "${mood}"
      และเลือกคำสะท้อนความรู้สึกคือ: "${words.join('", "')}"

      จงแต่งคำคม 1 บท ความยาวประมาณ 5-7 บรรทัด (สไตล์ Typography Art)
      เงื่อนไขสำคัญ (Algorithm การตัดคำ):
      1. ต้องลึกซึ้ง กระแทกใจ ให้ข้อคิดสะกิดใจ
      2. ใช้ภาษาที่สละสลวย ทรงพลัง ไม่เยิ่นเย้อ
      3. **สำคัญที่สุด**: ต้องขึ้นบรรทัดใหม่ (\\n) ถี่มากๆ ให้ขึ้นบรรทัดใหม่ทุกๆ 1 วลีสั้นๆ เท่านั้น
      4. **ห้ามพิมพ์ข้อความในบรรทัดเดียวยาวเกิน 6 คำเด็ดขาด** ให้หั่นบรรทัดให้ดูเหมือนบทกวี
      5. ห้ามตัดกลางคำ ให้ตัดตามจังหวะความหมาย
      6. ห้ามพิมพ์คำอธิบาย พิมพ์แค่ "ตัวคำคม" เท่านั้น

      ตัวอย่างการจัดหน้าและตัดบรรทัดที่ถูกต้อง (Balance และอ่านง่าย):
      ภาพสะท้อนในวงกต
      ที่พร่ามัว
      ไม่ใช่สัญญาณ
      ของการหลงทาง
      แต่คือนาทีที่ความสับสน...
      กำลังกลั่นกรองตัวตน
      ให้ชัดเจนยิ่งขึ้น
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