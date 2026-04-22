// นำเข้าไลบรารี mongoose และ Schema เพื่อใช้กำหนดโครงสร้างข้อมูล
import mongoose, { Schema } from "mongoose";

// สร้าง Schema สำหรับจัดเก็บข้อมูลการทำธุรกรรม (เช่น การส่งขยะเพื่อแลกแต้ม)
const TransactionSchema = new Schema(
  {
    // อ้างอิงไปยัง User ID: เก็บเป็น ObjectId ของ MongoDB
    // ref: 'User' หมายถึงฟิลด์นี้เชื่อมโยงกับ Model ที่ชื่อว่า 'User' (ใช้สำหรับทำ populate ดึงข้อมูลชื่อ/อีเมลผู้ใช้ได้)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // ประเภทขยะ: เก็บเป็นข้อความ (String) เช่น 'plastic', 'glass', 'paper'
    trashType: { type: String, required: true },

    // จำนวนแต้มที่ควรได้รับ: เก็บเป็นตัวเลข (Number)
    pointToReceive: { type: Number, required: true },

    // สถานะของรายการ: เก็บเป็นข้อความ (String)
    // enum: จำกัดค่าที่ยอมรับได้เพียง 3 อย่างคือ 'pending' (รอ), 'approved' (อนุมัติ), 'rejected' (ปฏิเสธ)
    // default: ถ้าไม่ได้ระบุสถานะมา ให้เริ่มที่ 'pending' เสมอ
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'     
    }
  },
  // Options: timestamps จะสร้าง createdAt (เวลาที่สร้างรายการ) และ updatedAt (เวลาที่แก้ไขล่าสุด) ให้อัตโนมัติ
  { timestamps: true }
);

// สร้าง Model ชื่อ "Transaction" 
// ตรวจสอบว่าถ้ามี Model นี้ในระบบแล้วให้ใช้ตัวเดิม ถ้ายังไม่มีให้สร้างใหม่จาก Schema ที่กำหนด
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

// ส่งออก Model เพื่อนำไปใช้งานในไฟล์ API หรือส่วนอื่นๆ ของโปรเจกต์
export default Transaction;