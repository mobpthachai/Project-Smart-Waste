import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req) {
    try {
        const { email } = await req.json();
        await connectMongoDB();
        
        // ค้นหา User ด้วยอีเมล และ .select("coin") คือขอเอามาแค่ฟิลด์เหรียญ (ถ้าใน model คุณตั้งชื่อว่า points ก็เปลี่ยนเป็น points นะครับ)
        const user = await User.findOne({ email }).select("points"); 
        
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
    }
}