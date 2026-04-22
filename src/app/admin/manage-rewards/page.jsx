"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function ManageWaste() {
  //State สำหรับเก็บข้อมูลที่กรอกจากฟอร์ม (ชื่อ, รูป, รายละเอียด, คะแนน, จำนวนสต็อก)
  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    pointsRequired: "",
    stock: ""
  });

  //State สำหรับเก็บข้อความแจ้งเตือนผู้ใช้ (เช่น "สำเร็จ" หรือ "เกิดข้อผิดพลาด")
  const [message, setMessage] = useState("");

  //ฟังก์ชันอัปเดต State ทุกครั้งที่มีการพิมพ์ข้อมูลใน Input
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //ฟังก์ชันหลักที่ทำงานเมื่อกดปุ่ม "Create Reward" (ส่งข้อมูลไป Backend)
  const onSubmit = async (e) => {
    e.preventDefault(); // ป้องกันหน้าเว็บ Refresh เมื่อกดส่งฟอร์ม
    setMessage("กำลังบันทึก...");

    try {
      // ยิง API แบบ POST เพื่อส่งข้อมูล JSON ไปที่เซิร์ฟเวอร์
      const res = await fetch("/api/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          // แปลงค่าตัวเลขจาก String เป็น Number ก่อนส่ง
          pointsRequired: Number(form.pointsRequired) || 0,
          stock: Number(form.stock) || 0
        })
      });

      const data = await res.json().catch(() => null); 

      //จัดการผลลัพธ์: ถ้าสำเร็จให้เคลียร์ค่าในฟอร์ม ถ้าพังให้แจ้ง Error
      if (res.ok) {
        setMessage("เพิ่มของรางวัลสำเร็จ ✅");
        setForm({ name: "", image: "", description: "", pointsRequired: "", stock: "" });
      } else {
        setMessage(`เกิดข้อผิดพลาด: ${data?.message || "ส่งข้อมูลไม่สำเร็จ"} ❌`);
      }
    } catch (error) {
      console.error(error);
      setMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ ❌");
    }
  };

  return (
    <div>
      <Navbar />
      <div className=" container mx-auto p-5">
        <h2 className="text-xl mb-4">Add Reward</h2>
        {/* ฟอร์มรับข้อมูล */}
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input name="name" placeholder="Name" value={form.name} onChange={onChange} />
          <input name="image" placeholder="Image URL" value={form.image} onChange={onChange} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} />
          <input name="pointsRequired" placeholder="Points Required" value={form.pointsRequired} onChange={onChange} />
          <input name="stock" placeholder="Stock" value={form.stock} onChange={onChange} />
          <button className="bg-green-500 border text-white p-2">Create Reward</button>
        </form>

        {/* ส่วนแสดงข้อความแจ้งเตือน (Message Feedback) */}
        {message && <p className="mt-3">{message}</p>}
      </div>
    </div>
  );
}