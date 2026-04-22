// นำเข้าไลบรารี mongoose และ Schema เพื่อใช้ในการกำหนดโครงสร้างข้อมูลสำหรับ MongoDB
import mongoose, { Schema } from "mongoose";

// กำหนดโครงสร้าง (Schema) ของข้อมูลที่ชื่อว่า "redeemHistorySchema" 
// เพื่อบอกว่าข้อมูลการแลกของรางวัล 1 ชุด จะต้องประกอบด้วยฟิลด์อะไรบ้าง
const redeemHistorySchema = new Schema(
  {
    // อีเมลของผู้ใช้งาน: เก็บเป็นข้อความ (String) และจำเป็นต้องมี (required)
    userEmail: { type: String, required: true }, 

    // ชื่อของรางวัลที่แลก: เก็บเป็นข้อความ (String) และจำเป็นต้องมี (required)
    rewardsName: { type: String, required: true },

    // คะแนนที่ใช้ไป: เก็บเป็นตัวเลข (Number) และจำเป็นต้องมี (required)
    pointsUsed: { type: Number, required: true },
  },
  // option เสริม (ถ้าใส่ { timestamps: true } ต่อท้าย จะช่วยเก็บเวลาที่สร้าง/แก้ไขให้อัตโนมัติ)
);

// สร้าง Model ชื่อ "RedeemHistory" เพื่อใช้ติดต่อกับฐานข้อมูล
// mongoose.models.RedeemHistory || ... คือการเช็กว่าถ้ามี Model นี้อยู่แล้วให้ใช้ตัวเดิม 
// แต่ถ้ายังไม่มี (เช่น รันครั้งแรก) ให้สร้าง Model ใหม่จาก Schema ที่เรากำหนดไว้
const RedeemHistory = mongoose.models.RedeemHistory || mongoose.model("RedeemHistory", redeemHistorySchema);

// ส่งออก Model เพื่อให้ไฟล์อื่นในโปรเจกต์ (เช่น API Route) นำไปใช้งานดึงข้อมูลหรือบันทึกข้อมูลได้
export default RedeemHistory;