import { NextResponse } from "next/server";
import Reward from "@/models/reward";
import User from "@/models/user";
import connectMongoDB from "@/lib/mongodb";
import RedeemHistory from "@/models/redeemhistory";

export async function POST(req) {
    try {
        // รับข้อมูล อีเมลผู้ใช้ และ ID ของรางวัลที่ต้องการแลก
        const { email, rewardId } = await req.json();
        await connectMongoDB();

        // ดึงข้อมูล User และ Reward จาก MongoDB มาตรวจสอบ
        const user = await User.findOne({ email });
        const reward = await Reward.findById(rewardId);

        // เช็กว่ามีข้อมูลทั้งคู่ไหม
        if (!user || !reward) {
            return NextResponse.json({ message: "ไม่พบข้อมูลผู้ใช้หรือของรางวัล" }, { status: 404 });
        }
        // ตรวจสอบว่าแต้มของผู้ใช้พอที่จะแลกรางวัลนี้หรือไม่
        if (user.points < reward.pointsRequired) {
            return NextResponse.json({ message: "แต้มของคุณไม่เพียงพอ ❌" }, { status: 400 });
        }

        // ตรวจสอบว่าของรางวัลยังมีสต็อกเหลืออยู่ไหม
        if (reward.stock <= 0) {
            return NextResponse.json({ message: "ของรางวัลหมดแล้ว ไม่สามารถแลกได้ ❌" }, { status: 400 });
        };
        // หักแต้มผู้ใช้ออกจากฐานข้อมูล ($inc ด้วยค่าติดลบ) จะลบเเต้มตามของที่หน้าเเอดมินกำหนดไว้
        await User.findOneAndUpdate(
            { email },
            { $inc: { points: -reward.pointsRequired } }
        );

        // ลดจำนวนสต็อกของรางวัลลง 1 ชิ้น
        await Reward.findByIdAndUpdate(rewardId, { $inc: { stock: -1 } });

        // บันทึกประวัติการแลกรางวัลลงใน Collection 'RedeemHistory' เพื่อเก็บไว้ดูย้อนหลัง
        await RedeemHistory.create({
            userEmail: email,
            rewardsName: reward.name,
            pointsUsed: reward.pointsRequired,
        });

        // ส่งการตอบกลับว่าแลกสำเร็จ
        return NextResponse.json({ message: "แลกรางวัลสำเร็จ! ✅" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในการแลกรางวัล" }, { status: 500 });
    }
}