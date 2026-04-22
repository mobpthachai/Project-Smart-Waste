import mongoose, { Schema } from "mongoose";
//สร้าง Database ไว้อัพโหลดของรางวัล
const rewardSchema = new Schema({
  name: { type: String, required: true },        // ชื่อของรางวัล
  image: { type: String, required: true },       // รูป
  description: String,                           // รายละเอียด
  pointsRequired: { type: Number, required: true }, // ใช้กี่แต้ม
  stock: { type: Number, default: 0 },           // ของเหลือกี่ชิ้น
}, { timestamps: true });

// ส่งออก Model (ตัวแทนสำหรับสั่งงาน Database)
// เช็กว่ามี Model "Reward" อยู่ในระบบหรือยัง ถ้ามีแล้วให้ใช้ตัวเดิม (mongoose.models.Reward)
// ถ้ายังไม่มี ให้สร้างใหม่โดยใช้ชื่อ "Reward" และใช้โครงสร้างจาก rewardSchema
export default mongoose.models.Reward || mongoose.model("Reward", rewardSchema);