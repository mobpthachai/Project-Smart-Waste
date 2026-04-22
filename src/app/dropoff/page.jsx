"use client"
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from 'react'

export default function DropOffPage() { 
    // ดึงข้อมูล Session ของผู้ใช้ที่ล็อกอินอยู่
    const { data: session, status } = useSession();
    
    // State สำหรับเก็บข้อมูลที่ผู้ใช้เลือก (ประเภทขยะ และ น้ำหนัก)
    const [wasteType, setWasteType] = useState("");
    const [weight, setWeight] = useState(0);

    // กำหนดอัตราแลกเปลี่ยนแต้มต่อกิโลกรัม และคำนวณแต้มแบบ Real-time
    const pointsPerKg = { plastic: 10, paper: 5, metal:15};
    const calculatedPoints = (pointsPerKg[wasteType] || 0) * weight; 

    //  ฟังก์ชันส่งข้อมูลไปยัง API เมื่อผู้ใช้กดปุ่มส่ง
    const handleSubmit = async (e) =>{
    e.preventDefault();

    // ตรวจสอบความปลอดภัยเบื้องต้นว่าล็อกอินหรือยัง
    if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนครับ");
        return;
    }
    
    try {
        // ยิง Fetch POST ไปยัง API /api/dropoff เพื่อบันทึกลง MongoDB
        const res = await fetch("/api/dropoff", {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({
              email: session?.user?.email, 
              wasteType: wasteType,       
              weight: weight,               
              pointToReceive: calculatedPoints, // ส่งแต้มที่คำนวณได้ไปบันทึก
        }),
      });

        if (res.ok) {
            alert("ส่งข้อมูลสำเร็จ! กรุณารอเจ้าหน้าที่ตรวจสอบและอนุมัติแต้ม🪙");
        } else {
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล❌");
        }
    } catch (error) {
        console.log("Error:", error);
    }
};

  return (
    <div>
      <Navbar session={session}/>
      <div className="body5" >
      <h1>สะสมเหรียญขยะ</h1>
      
      {/* ฟอร์มรับข้อมูลจากผู้ใช้ */}
      <form onSubmit={handleSubmit}>
      <p className="text2">สวัสดีคุณ {session?.user?.name} วันนี้มีอะไรมาทิ้งดีครับ</p>
      
      {/* ส่วนเลือกประเภทขยะ */}
      <label className="block">
        <span className="text-grey-700">ประเภทขยะ</span>
        <select onChange={(e) => setWasteType(e.target.value)} className="...">
              <option value="">-- เลือกประเภท --</option>
              <option value="plastic">ขวดพลาสติก (10 แต้ม/กก.)</option>
              <option value="paper">กระดาษ/ลัง (5 แต้ม/กก.)</option>
              <option value="metal">โลหะ/กระป๋อง (15 แต้ม/กก.)</option>
        </select>
      </label>
      <label className="block">
        <span className="text-gray-700">น้ำหนัก (กิโลกรัม)</span>
        <input type="number" onChange={(e) => setWeight(e.target.value)} className="..." placeholder="0.00"/>
      </label>

      {/* ส่วนแสดงผลการคำนวณแต้มให้ผู้ใช้เห็นทันที */}
      <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
        <p className="text-sm text-green-700">คุณจะได้รับแต้มประมาณ</p>
        <p className="text-3xl font-bold text-green-600">{calculatedPoints} 🪙</p>
      </div>

      <button type='submit' className="...">ส่งข้อมูลให้เจ้าหน้าที่ตรวจสอบ</button>
      </form>
      </div>
      
      <Link href="http://localhost:3000">
          <button className="body6 cursor-pointer" >Back </button>
      </Link>
    </div>
  )
}