import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import bcrypt from 'bcryptjs'

export async function POST(req){
    try{
        //เป็นการเก็บค่า ชื่อ อีเมบ รหัสผ่าน
        const {name, email, password,} = await req.json();
        // การรักษาความปลอดภัย: เข้ารหัสรหัสผ่าน (Hash) ก่อนบันทึก 
        // เลข 10 คือ Salt Rounds (ยิ่งเยอะยิ่งปลอดภัยแต่ใช้เวลาประมวลผลนานขึ้น)
        const hashedPassword = await bcrypt.hash(password, 10)
        
        // เชื่อมต่อฐานข้อมูล และสั่งสร้าง (Create) ข้อมูลผู้ใช้ใหม่ลงใน Collection 'users'
        await connectMongoDB();
        await User.create({ name, email, password: hashedPassword })

        return NextResponse.json({ message:"User Registered"}, {status: 201 });
    }catch(error){
        console.log("Error in API Register:", error);
        return NextResponse.json({ message: "An error occured while registraring" }, {status: 500 });
    }
}//หน้าที่ไว้สำหรับ "สร้างผู้ใช้ใหม่ (Create)" เท่านั้น 