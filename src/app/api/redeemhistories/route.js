import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import RedeemHistory from "@/models/redeemhistory"; 

export async function GET(req) {
    try {
        // เชื่อมต่อฐานข้อมูล MongoDB
        await connectMongoDB();
        
        // ดึงค่า email จาก URL Parameter (เช่น /api/history?email=test@test.com)
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        // ตรวจสอบว่าหน้าบ้านส่งอีเมลมาด้วยไหม
        if (!email) {
            return NextResponse.json({ message: "ระบุอีเมลด้วยครับ" }, { status: 400 });
        }

        // ค้นหาใน Collection 'RedeemHistory' เฉพาะรายการที่ 'userEmail' ตรงกับที่ระบุ
        // พร้อมสั่ง .sort({ createdAt: -1 }) เพื่อเอาประวัติล่าสุดขึ้นก่อน
        const history = await RedeemHistory.find({ userEmail: email }).sort({ createdAt: -1 });
        
        // ส่งรายการประวัติทั้งหมดกลับไปให้หน้า Frontend ในรูปแบบ Array
        return NextResponse.json({ history }, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}