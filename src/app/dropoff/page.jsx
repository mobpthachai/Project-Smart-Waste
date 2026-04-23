"use client"
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from 'react'

export default function DropOffPage() { 
    const { data: session } = useSession();

    const [wasteType, setWasteType] = useState("");
    const [weight, setWeight] = useState(0);

    const pointsPerKg = { plastic: 10, paper: 5, metal: 15 };
    const calculatedPoints = (pointsPerKg[wasteType] || 0) * weight;

    const handleSubmit = async (e) =>{
        e.preventDefault();

        if (!session) {
            alert("กรุณาเข้าสู่ระบบก่อนครับ");
            return;
        }
    
        try {
            const res = await fetch("/api/dropoff", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: session?.user?.email, 
                    wasteType,
                    weight: Number(weight),
                    pointToReceive: calculatedPoints,
                }),
            });

            if (res.ok) {
                alert("ส่งข้อมูลสำเร็จ! 🪙");
            } else {
                alert("เกิดข้อผิดพลาด ❌");
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar session={session}/>

      <div className="flex justify-center items-center py-10 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

          <h1 className="text-2xl font-bold text-center mb-4">
            ♻️ สะสมเหรียญขยะ
          </h1>

          <p className="text-center text-gray-600 mb-6">
            สวัสดีคุณ {session?.user?.name || "ผู้ใช้งาน"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ประเภทขยะ */}
            <div>
              <label className="block text-sm mb-1">ประเภทขยะ</label>
              <select
                onChange={(e) => setWasteType(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400"
              >
                <option value="">-- เลือกประเภท --</option>
                <option value="plastic">ขวดพลาสติก (10 แต้ม/กก.)</option>
                <option value="paper">กระดาษ (5 แต้ม/กก.)</option>
                <option value="metal">โลหะ (15 แต้ม/กก.)</option>
              </select>
            </div>

            {/* น้ำหนัก */}
            <div>
              <label className="block text-sm mb-1">น้ำหนัก (กก.)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400"
                placeholder="0.00"
              />
            </div>

            {/* แสดงแต้ม */}
            <div className="bg-green-50 p-4 rounded-lg text-center border">
              <p className="text-sm text-green-700">คุณจะได้รับ</p>
              <p className="text-3xl font-bold text-green-600">
                {calculatedPoints} 🪙
              </p>
            </div>

            {/* ปุ่ม submit */}
            <button 
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
            >
              ส่งข้อมูลให้เจ้าหน้าที่ตรวจสอบ
            </button>

          </form>

          {/* ปุ่มกลับ */}
          <Link href="/">
            <button className="mt-4 w-full border py-2 rounded-lg hover:bg-gray-100">
              ⬅ กลับหน้าแรก
            </button>
          </Link>

        </div>
      </div>
    </div>
  )
}