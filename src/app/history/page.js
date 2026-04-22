"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"; 
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function HistoryRedeem() {
    // 1. ดึงข้อมูล Session และสถานะการโหลด (status) ของผู้ใช้
    const { data: session, status } = useSession();
    const router = useRouter(); 
    const [history, setHistory] = useState([]); // เก็บรายการประวัติที่ดึงมาจาก API
    const [loading, setLoading] = useState(true); // สถานะการรอโหลดข้อมูล

    useEffect(() => {
        // Security Guard: ถ้าตรวจสอบแล้วว่าไม่ได้ล็อกอิน ให้เด้งไปหน้า login ทันที
        if (status === "unauthenticated") {
            router.push('/login');
            return;
        }

        // 3. ฟังก์ชันดึงประวัติการแลกรางวัลจาก API โดยส่ง email ไปเป็นเงื่อนไขในการค้นหา
        const getHistory = async () => {
            if (status === "authenticated" && session?.user?.email) {
                try {
                    // เรียก API และส่ง Query String ไประบุตัวตนผู้ใช้
                    const res = await fetch(`/api/redeemhistories?email=${session.user.email}`);
                    const data = await res.json();
                    
                    if (res.ok) {
                        setHistory(data.history || []); // เก็บข้อมูลประวัติลงใน State
                    }
                } catch (error) {
                    console.error("Fetch History Error:", error);
                } finally {
                    setLoading(false); // ปิดสถานะการโหลดไม่ว่าจะสำเร็จหรือไม่
                }
            }
        };

        if (status !== "loading") {
            getHistory();
        }
    }, [session, status, router]);

    // แสดงข้อความระหว่างรอการเช็คสิทธิ์หรือโหลดข้อมูลจาก Database
    if (loading || status === "loading") {
        return <p className="text-center p-10">กำลังโหลด...</p>;
    }

    // ถ้าไม่มีข้อมูล Session ให้แสดงลิงก์เผื่อระบบไม่ Redirect อัตโนมัติ
    if (!session) {
        return (
            <div className="text-center p-10">
                <p>กำลังพาคุณไปหน้าเข้าสู่ระบบ...</p>
                <Link href="/login" className="text-blue-500 underline">คลิกที่นี่หากระบบไม่เปลี่ยนหน้า</Link>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-6 max-w-2xl">
                <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
                    ประวัติการแลกของรางวัล
                </h1>
                
                {/* การแสดงผลแบบมีเงื่อนไข (Conditional Rendering) */}
                {history.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
                        <p className="text-gray-500">คุณยังไม่มีประวัติการแลกของรางวัลในขณะนี้</p>
                    </div>
                ) : (
                    // กรณีมีข้อมูล ให้ทำการ Loop ข้อมูลมาแสดงในรูปแบบ List Card
                    <div className="space-y-4">
                        {history.map((item) => (
                            <div key={item._id} className="...">
                                <div className="flex flex-col">
                                    <span className="text-lg font-semibold text-gray-800">
                                        {item.rewardsName} {/* แสดงชื่อของรางวัล */}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-red-500">
                                        -{item.pointsUsed} {/* แสดงจำนวนแต้มที่ถูกหักไป */}
                                    </span>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Points🪙</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HistoryRedeem;