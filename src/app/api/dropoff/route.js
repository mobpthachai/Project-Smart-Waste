import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import Transaction from "@/models/transaction";

export async function POST(req) {
  try {
    //รับข้อมูลการทิ้งขยะจากหน้าบ้าน
    const { email, wasteType, pointToReceive } = await req.json();

    await connectMongoDB();

    // 1. หาข้อมูล User จาก email ก่อน เพื่อเอา _id มาเก็บใน Transaction
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // สร้างรายการธุรกรรม (Transaction) ใหม่ใน MongoDB
    // โดยสถานะเริ่มต้นมักจะเป็น 'pending' (รอตรวจสอบ) ตามที่กำหนดไว้ใน Model
    await Transaction.create({
      userId: user._id,      // อ้างอิง ID ของผู้ใช้
      trashType: wasteType,  // ประเภทขยะที่นำมาทิ้ง   
      pointToReceive: Number(pointToReceive), // แต้มที่รอการอนุมัติ
    });

    return NextResponse.json(
      { message: "ส่งข้อมูลสำเร็จ กรุณารอเจ้าหน้าที่ตรวจสอบ" },
      { status: 201 }
    );

  } catch (error) {
    console.log("DROP OFF ERROR:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการบันทึกรายการ" },
      { status: 500 }
    );
  }
}