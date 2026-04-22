import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";         // ใช้ @ แทนการนับจุด
import Transaction from "@/models/transaction"; // ใช้ @ แทนการนับจุด

export async function POST(req) {
    try {
        const { transactionId, action } = await req.json(); // รับค่าจาก Frontend (ID ของรายการ และคำสั่งว่าจะ อนุมัติ หรือ ปฏิเสธ)
        await connectMongoDB();

        // ค้นหาข้อมูลรายการ (Transaction) ใน MongoDB ด้วย ID
        const transaction = await Transaction.findById(transactionId);
        if (!transaction || transaction.status !== 'pending') {
            return NextResponse.json({ message: "ไม่พบรายการที่รออนุมัติ" }, { status: 404 });
        }

        if (action === 'approve') {
            // ถ้าอนุมัติ: บวกแต้มให้ User จริงๆ
            await User.findByIdAndUpdate(transaction.userId, {
                $inc: { points: transaction.pointToReceive }
            });
            // เปลี่ยนสถานะเป็น approved
            transaction.status = 'approved';
        } else {
            // ถ้าปฏิเสธ: เปลี่ยนสถานะเป็น rejected
            transaction.status = 'rejected';
        }
        // บันทึกการเปลี่ยนแปลงสถานะลงใน MongoDB
        await transaction.save();
        return NextResponse.json({ message: `ดำเนินการ ${action} สำเร็จ` }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
    }
}