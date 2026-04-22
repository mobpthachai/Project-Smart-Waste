import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
async function createAdmin() {
  try {
    //เชื่อมต่อกับ MongoDB Atlas ตามที่ระบุไว้ใน .env
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const email = "Admin1@ggg";
    const password = "Admin1@ggg";

    //ค้นหาใน Database ว่ามี User ที่ใช้อีเมลนี้อยู่แล้วหรือไม่
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("❌ Admin มีอยู่แล้ว");
      process.exit();
    }
    // ทำการเข้ารหัสรหัสผ่าน (Hash) ด้วย bcrypt 10 รอบ เพื่อความปลอดภัย
    // ห้ามเก็บรหัสผ่านตัวเต็ม (Plain text) ลงในฐานข้อมูลเด็ดขาด
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกข้อมูล Admin ใหม่ลงใน Collection 'users'
    const admin = await User.create({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
      points: 0,
    });

    console.log("🎉 สร้าง Admin สำเร็จ!");
    console.log(admin);

    process.exit();
  } catch (error) {
    console.error("❌ ERROR:", error);
    process.exit(1);
  }
}

createAdmin();
//คำสั่งส้ราง Adimn: node createAdmin.js