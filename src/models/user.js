import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
    {
        name: {
            type: String,       // กำหนดว่าเป็นข้อความ (String)
            required: true,      // บังคับว่าต้องมีข้อมูล (ห้ามว่าง)
        },
        email: {
            type: String,       // กำหนดว่าเป็นข้อความ (String)
            required: true,      // บังคับว่าต้องมีข้อมูล
        },
        password: {
            type: String,       // กำหนดว่าเป็นข้อความ (String)
        },
        role: {
            type: String,       // กำหนดระดับผู้ใช้งาน (เช่น user, admin)
            required: false,     // ไม่บังคับว่าต้องใส่มาตอนสมัคร
            default: "user"     // ถ้าไม่ใส่มา ระบบจะตั้งค่าเริ่มต้นให้เป็น "user" อัตโนมัติ
        },
        points: {
            type: Number,       // กำหนดว่าเป็นตัวเลข (Number)
            default: 0          // ถ้าเริ่มสมัครใหม่ จะให้แต้มเริ่มต้นเป็น 0
        }
    },
    { 
        timestamps: true        // สั่งให้ระบบสร้างฟิลด์ createdAt (สร้างเมื่อไหร่) และ updatedAt (แก้ไขเมื่อไหร่) ให้เองอัตโนมัติ
    }
)

// ตรวจสอบว่ามี Model ชื่อ "User" ถูกสร้างไว้หรือยัง 
// ถ้ามีแล้วให้ใช้ของเดิม (mongoose.models.User) 
// ถ้ายังไม่มีให้สร้างใหม่ (mongoose.model("User", userSchema))
// วิธีนี้ช่วยป้องกัน Error เมื่อมีการรีโหลดหน้าเว็บใน Next.js
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User; 