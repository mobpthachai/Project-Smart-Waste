"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"; 
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function RewardsPage() {
    const { data: session } = useSession(); // ดึงข้อมูลผู้ใช้เพื่อใช้ Email ในการแลกรางวัล
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);

    // ดึงรายการของรางวัลทั้งหมดมาจากฐานข้อมูล (GET /api/rewards)
    useEffect(() => {
        const getRewards = async () => {
            try {
                const res = await fetch("/api/rewards");
                if (res.ok) {
                    const data = await res.json();
                    setRewards(data.rewards); // เก็บรายการของรางวัลลง State
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        getRewards();
    }, []);

    // ฟังก์ชันจัดการการแลกรางวัลเมื่อมีการกดปุ่ม
    const handleRedeem = async (reward) => {
        // ตรวจสอบว่าเข้าสู่ระบบหรือยัง
        if (!session) {
            alert("กรุณาเข้าสู่ระบบก่อนทำการแลกรางวัล");
            return;
        }

        // ยืนยันความสมัครใจของผู้ใช้
        const confirmRedeem = confirm(`ยืนยันการแลก ${reward.name} โดยใช้ ${reward.pointsRequired} แต้ม?`);
        
        if (confirmRedeem) {
            try {
                // ยิง API ไปที่ /api/redeem เพื่อหักแต้มใน MongoDB
                const res = await fetch("/api/redeem", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: session.user.email,
                        rewardId: reward._id
                    })
                });

                const data = await res.json();

                if (res.ok) {
                    alert(data.message);
                    window.location.reload(); // รีโหลดเพื่อให้แต้มบน Navbar อัปเดตล่าสุด
                } else {
                    alert(data.message); // แจ้งเตือนกรณีแต้มไม่พอ หรือ ของหมด
                }
            } catch (error) {
                console.error("Redeem Error:", error);
                alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
            }
        }
    };

    if (loading) return <p className="text-center p-10">กำลังโหลดของรางวัล...</p>;

    return (
        <div >
            <Navbar />
            <h1 className = "text-2xl font-bold mb-6">รายการของรางวัล</h1>
            
            {/* ส่วนการแสดงผล (UI) แบบ Grid Card */}
            <div className="body7 grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                    <div key={reward._id} className="border p-4 rounded-lg shadow">
                        <img src={reward.image} alt={reward.name} className="..." />
                        <h2 className="text-xl font-bold mt-2">{reward.name}</h2>
                        <p className="text-gray-600">{reward.description}</p>
                        
                        {/* แสดงเงื่อนไขการแลก */}
                        <p className="text-blue-600 font-bold mt-2">ใช้แต้ม🪙: {reward.pointsRequired}</p>
                        <p className="text-blue-600 font-bold mt-2">Stock เหลือ: {reward.stock}</p>
                        
                        {/*  ปุ่มกดแลกรางวัล */}
                        <button 
                            onClick={() => handleRedeem(reward)} 
                            className="bg-green-500 text-white w-full py-2 mt-4 rounded hover:bg-green-600 transition"
                        > 
                            แลกรางวัล 
                        </button>
                    </div>
                ))}
            </div>
            
            <Link href="http://localhost:3000">
                <button className="body6 cursor-pointer" >Back </button>
            </Link>
        </div>
    );
}