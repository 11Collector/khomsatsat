// ไฟล์: data/bmcCards.ts

export type BMCCard = {
  text: string;
  emoji: string;
  budgetTags: string[]; // "0", "5000", "100000", "all"
  leverageTags: string[]; // "media", "system", "network", "capital", "all"
};

export type BMCCategory = {
  id: string;
  name: string;
  title: string;
  color: string;
  bg: string;
  cards: BMCCard[];
};

export const bmcCategoriesData: BMCCategory[] = [
  {
    id: "CS", name: "Customer Segments", title: "ใครคือเหยื่อของเรา?", color: "text-blue-600", bg: "bg-blue-500",
    cards: [
      { text: "พนักงานออฟฟิศปวดหลัง ที่บ่นอยากลาออกทุกวันจันทร์", emoji: "🧟‍♂️", budgetTags: ["all"], leverageTags: ["all"] },
      { text: "เจ้าของกิจการวัยเก๋า ที่ยิงแอดไม่เป็นและโดนเอเจนซี่หลอกประจำ", emoji: "👴", budgetTags: ["0", "5000"], leverageTags: ["system", "media"] },
      { text: "คุณแม่ลูกอ่อน ที่ไม่มีเวลาพักผ่อนและอยากหุ่นกลับมาเป๊ะ", emoji: "🤱", budgetTags: ["all"], leverageTags: ["media", "network"] },
      { text: "นักลงทุนมือใหม่ ที่ติดดอยและต้องการที่พึ่งทางใจ", emoji: "📉", budgetTags: ["all"], leverageTags: ["system", "network"] },
      { text: "คนรวยเทสดี ที่พร้อมจ่ายแพงขอแค่งานจบและไม่ปวดหัว", emoji: "💎", budgetTags: ["100000"], leverageTags: ["capital", "system"] },
      { text: "วัยรุ่นสร้างตัว ที่อยากดูรวยแต่เงินในบัญชีช็อต", emoji: "💸", budgetTags: ["0", "5000"], leverageTags: ["media"] }
    ]
  },
  {
    id: "VP", name: "Value Proposition", title: "จุดขาย (ทำไมเขาต้องง้อเรา?)", color: "text-red-500", bg: "bg-red-500",
    cards: [
      { text: "ลดความเสี่ยง 100% (เราเจ็บแทนให้ ไม่ดีคืนเงิน)", emoji: "🛡️", budgetTags: ["100000"], leverageTags: ["capital"] },
      { text: "ความสะดวกขั้นสุด (กดปุ่มเดียวจบ ไม่ต้องคิดเอง)", emoji: "🚀", budgetTags: ["5000", "100000"], leverageTags: ["system"] },
      { text: "เยียวยาจิตใจ (แก้เครียด ซื้อไปแล้วได้ขิงเพื่อน)", emoji: "📸", budgetTags: ["0", "5000"], leverageTags: ["media"] },
      { text: "ระบบสำเร็จรูป (ก็อปปี้ไปวางแล้วหาเงินได้เลย)", emoji: "⚙️", budgetTags: ["all"], leverageTags: ["system"] },
      { text: "สังคมคนหัวอกเดียวกัน (มีเพื่อนคุย ไม่เหงา)", emoji: "🍻", budgetTags: ["0", "5000"], leverageTags: ["network"] },
      { text: "🌟 (ไพ่ลับ) แพลตฟอร์ม Social Commerce ที่มีพี่เลี้ยงจับมือทำ", emoji: "🤝", budgetTags: ["0", "5000"], leverageTags: ["network", "media", "system"] } // ปูทางไปแอมเวย์
    ]
  },
  {
    id: "CH", name: "Channels", title: "ช่องทาง (ไปดักปล้นที่ไหน?)", color: "text-yellow-500", bg: "bg-yellow-400",
    cards: [
      { text: "ทำคลิปสั้นลง TikTok/Reels ให้ไวรัลแล้วติดตะกร้า", emoji: "🎵", budgetTags: ["0", "5000"], leverageTags: ["media"] },
      { text: "ยิงแอด Conversion อัดงบหลักหมื่นตามหลอนทุกแอป", emoji: "🎯", budgetTags: ["100000"], leverageTags: ["capital", "system"] },
      { text: "ทักแชท/โทรหาคอนเนคชันเก่าๆ แบบตรงไปตรงมา", emoji: "☎️", budgetTags: ["0"], leverageTags: ["network"] },
      { text: "สร้างกลุ่ม Facebook/Line ลับ ดักคนที่มีปัญหาเดียวกัน", emoji: "🤫", budgetTags: ["0", "5000"], leverageTags: ["network", "system"] },
      { text: "จ้าง Influencer / KOL เบอร์ใหญ่รีวิวแบบตะโกน", emoji: "🤩", budgetTags: ["100000"], leverageTags: ["capital"] }
    ]
  },
  {
    id: "CR", name: "Customer Relationships", title: "ความสัมพันธ์ (เลี้ยงไข้ยังไง?)", color: "text-green-500", bg: "bg-green-500",
    cards: [
      { text: "เป็นที่ปรึกษาส่วนตัว (คุยเก่งกว่าหมอจิตวิทยา)", emoji: "🛋️", budgetTags: ["0", "5000"], leverageTags: ["network"] },
      { text: "ระบบ Automation (บอทตอบไว ปิดการขายตอนตี 2)", emoji: "🤖", budgetTags: ["5000", "100000"], leverageTags: ["system"] },
      { text: "บริการหลังการขายระดับพรีเมียม VIP (ดูแลดุจลูกหลาน)", emoji: "👑", budgetTags: ["100000"], leverageTags: ["capital"] },
      { text: "สร้าง Community ให้ลูกค้าคุยกันเอง (เรานั่งดู)", emoji: "🏕️", budgetTags: ["0", "5000"], leverageTags: ["network", "media"] },
      { text: "ทิ้งขว้างแบบ One-night stand (ขายขาด จบแล้วจบเลย)", emoji: "🏃", budgetTags: ["all"], leverageTags: ["media", "system"] }
    ]
  },
  {
    id: "RS", name: "Revenue Streams", title: "รายได้ (เงินเข้าท่าไหน?)", color: "text-blue-600", bg: "bg-blue-500",
    cards: [
      { text: "กินค่าคอมมิชชัน (Affiliate / นายหน้าหน้าเลือด)", emoji: "💰", budgetTags: ["0", "5000"], leverageTags: ["media", "network"] },
      { text: "เก็บค่าสมาชิกรายเดือน (Subscription ตัดบัตรเนียนๆ)", emoji: "💳", budgetTags: ["5000", "100000"], leverageTags: ["system", "capital"] },
      { text: "ขายความรู้ / E-book / เทมเพลต (ต้นทุนผลิตครั้งเดียว 0 บาท)", emoji: "🧠", budgetTags: ["0"], leverageTags: ["system", "media"] },
      { text: "กินส่วนต่างราคาสินค้า (ซื้อมาขายไป เน้นหมุนไว)", emoji: "📦", budgetTags: ["5000", "100000"], leverageTags: ["capital", "network"] },
      { text: "🌟 (ไพ่ลับ) สร้างเครือข่ายผู้บริโภค เกิดรายได้แบบ Passive", emoji: "📈", budgetTags: ["0", "5000"], leverageTags: ["network"] } // โยงเข้าแนวคิดเครือข่าย
    ]
  },
  {
    id: "KR", name: "Key Resources", title: "ทรัพยากรหลัก (มีของดีอะไร?)", color: "text-red-500", bg: "bg-red-500",
    cards: [
      { text: "หน้าตาดี คารมได้ และความหน้าด้านของตัวเอง", emoji: "😎", budgetTags: ["0"], leverageTags: ["media", "network"] },
      { text: "เงินทุนหนา พร้อมสาดงบซื้อเวลาและซื้อคนเก่งๆ", emoji: "💸", budgetTags: ["100000"], leverageTags: ["capital"] },
      { text: "สูตรลับ / ทักษะเฉพาะตัวที่คนอื่นเลียนแบบยาก (Specific Knowledge)", emoji: "🧬", budgetTags: ["all"], leverageTags: ["system", "media"] },
      { text: "คอนเนคชันเพื่อนฝูงที่พร้อมโดนหลอกมาช่วยงาน", emoji: "🤝", budgetTags: ["0", "5000"], leverageTags: ["network"] },
      { text: "ระบบหลังบ้านสำเร็จรูปของพาร์ทเนอร์ (ไม่ต้องสต็อกของ)", emoji: "🏭", budgetTags: ["0", "5000"], leverageTags: ["system", "network"] }
    ]
  },
  {
    id: "KA", name: "Key Activities", title: "กิจกรรมหลัก (วันๆ ทำอะไร?)", color: "text-yellow-500", bg: "bg-yellow-400",
    cards: [
      { text: "อัดคลิป ตัดต่อ ไถฟีดส่องกระแสจนตาแฉะ", emoji: "🎬", budgetTags: ["0", "5000"], leverageTags: ["media"] },
      { text: "นั่งวิเคราะห์ Data ปรับแต่งระบบ และสบถใส่หน้าจอ", emoji: "👨‍💻", budgetTags: ["5000", "100000"], leverageTags: ["system"] },
      { text: "ออกไปจิบกาแฟ คุยกับคน สร้างคอนเนคชันหาดีลใหม่ๆ", emoji: "☕", budgetTags: ["all"], leverageTags: ["network", "capital"] },
      { text: "เซ็นเอกสาร จ่ายเงินลูกน้อง แล้วไปตีกอล์ฟ", emoji: "⛳", budgetTags: ["100000"], leverageTags: ["capital"] },
      { text: "แพ็คของวนไปจนหลังขดหลังแข็ง รอขนส่งมารับ", emoji: "📦", budgetTags: ["5000"], leverageTags: ["system", "media"] }
    ]
  },
  {
    id: "KP", name: "Key Partnerships", title: "พาร์ทเนอร์ (ใครคือเดอะแบก?)", color: "text-green-500", bg: "bg-green-500",
    cards: [
      { text: "พี่มาร์ค พี่ติ๊กต็อก (แพลตฟอร์มที่ชอบปรับอัลกอริทึมแกล้งเรา)", emoji: "🌐", budgetTags: ["all"], leverageTags: ["media"] },
      { text: "เอเจนซี่ / ฟรีแลนซ์ ที่จ้างมาทำงานรูทีนแทน", emoji: "💼", budgetTags: ["100000"], leverageTags: ["capital", "system"] },
      { text: "แบรนด์สินค้า / โรงงานผลิต ที่ดรอปชิปให้เรา", emoji: "🏭", budgetTags: ["0", "5000"], leverageTags: ["system", "media"] },
      { text: "🌟 (ไพ่ลับ) แบรนด์ระดับ Global ที่มีระบบ R&D และคลังสินค้าให้พร้อมลุย", emoji: "🏢", budgetTags: ["0", "5000"], leverageTags: ["network", "system"] } // ปูทางเข้า Amway
    ]
  },
  {
    id: "CS", name: "Cost Structure", title: "ต้นทุน (เลือดไหลออกทางไหน?)", color: "text-stone-700", bg: "bg-stone-700",
    cards: [
      { text: "ค่าเครื่องมือ AI และระบบ Subscription รายเดือนสุดโหด", emoji: "💻", budgetTags: ["5000", "100000"], leverageTags: ["system"] },
      { text: "ค่ายิงแอดที่แพงขึ้นทุกวัน เผาเงินเหมือนแบงก์กงเต็ก", emoji: "🔥", budgetTags: ["5000", "100000"], leverageTags: ["media", "capital"] },
      { text: "ค่ากาแฟ ค่าเลี้ยงข้าว ค่าน้ำมันรถ ออกไปหาคอนเนคชัน", emoji: "⛽", budgetTags: ["0", "5000"], leverageTags: ["network"] },
      { text: "ค่าจ้างลูกน้อง ค่าเช่าออฟฟิศ (Fix Cost ที่บีบหัวใจทุกสิ้นเดือน)", emoji: "🏢", budgetTags: ["100000"], leverageTags: ["capital"] },
      { text: "แรงกาย แรงใจ และค่ากายภาพบำบัดแก้ปวดหลัง (เพราะใช้แรงตัวเองล้วนๆ)", emoji: "🏥", budgetTags: ["0"], leverageTags: ["media", "system"] }
    ]
  }
];