import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Reward from "@/models/reward"; 

export async function POST(req) {
    try {
        await connectMongoDB();
        // รับข้อมูลของรางวัลทั้งหมดจากฟอร์มหน้าบ้าน (body)
        const body = await req.json();

        // สั่ง MongoDB ให้สร้าง (Create) ข้อมูลของรางวัลชิ้นใหม่ลงใน Collection 'rewards'
        await Reward.create(body);

        return NextResponse.json({ message: "สร้างของรางวัลสำเร็จ ✅" }, { status: 201 });
    } catch (error) {
        console.error("Error creating reward:", error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในการบันทึก" }, { status: 500 });
    }
}

// --- ส่วนของการดึงข้อมูล (Read) ---
export async function GET() {
    try {
        await connectMongoDB();
        // ค้นหา (Find) ข้อมูลของรางวัล "ทั้งหมด" ที่มีอยู่ในฐานข้อมูล
        const rewards = await Reward.find({});

        // ส่งรายการของรางวัลทั้งหมดกลับไปในรูปแบบ Array เพื่อนำไปโชว์ในหน้าเว็บ rewards.js
        return NextResponse.json({ rewards }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
    }
}