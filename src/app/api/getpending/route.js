import { NextResponse } from "next/server";
import Transaction from "@/models/transaction";
import connectMongoDB from "@/lib/mongodb";

export async function GET() {
    try {
        // เชื่อมต่อฐานข้อมูล MongoDB
        await connectMongoDB();
        
        // ค้นหาข้อมูลใน Collection 'transactions' โดยมีเงื่อนไขหลัก 3 อย่าง:
        const pendingList = await Transaction.find({ status: "pending" }) // กรองเอาเฉพาะสถานะ "รออนุมัติ"
            .populate("userId", "email") // เชื่อมโยงข้อมูลไปยัง Collection 'users' เพื่อดึงอีเมลเจ้าของรายการมาโชว์
            .sort({ createdAt: -1 });    // เรียงลำดับจากรายการใหม่ล่าสุดขึ้นก่อน

        // ส่งรายการที่กรองเสร็จแล้วกลับไปให้หน้า Frontend ในรูปแบบ JSON
        return NextResponse.json({ pendingList }, { status: 200 });
        
    } catch (error) {
        // กรณีเกิดข้อผิดพลาดในการดึงข้อมูล
        console.error("API GET ERROR:", error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดที่ Server" }, { status: 500 });
    }
}