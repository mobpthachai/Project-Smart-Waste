"use client"
import React, { useState, useEffect } from 'react';
import Navbar from "@/app/components/Navbar";

export default function AdminApprovePage() {
    // State สำหรับเก็บรายการคำขอที่รออนุมัติทั้งหมดที่ดึงมาจาก Database
    const [pendingTasks, setPendingTasks] = useState([]);

    // เมื่อเปิดหน้าเว็บ ให้เรียกใช้ฟังก์ชันดึงข้อมูลทันที (ทำงานครั้งเดียว)
    useEffect(() => {
        fetchPendingTasks();
    }, []);

    // ฟังก์ชันดึงรายการที่สถานะเป็น 'Pending' (รอตรวจ) จาก API
    const fetchPendingTasks = async () => {
        const res = await fetch("/api/getpending") // เรียก API เพื่อขอข้อมูล
        if (!res.ok) {
            console.error("Fetch failed with status:", res.status);
            return;
        }
        const data = await res.json();
        setPendingTasks(data.pendingList || []); // อัปเดตรายการในหน้าจอ
    };

    // ฟังก์ชันสำหรับกดปุ่ม 'อนุมัติ' หรือ 'ปฏิเสธ'
    const handleAction = async (transactions, action) => {
        try {
            // ส่ง ID ของรายการ และคำสั่ง (approve/reject) ไปที่ API Backend (route.js)
            const res = await fetch("/api/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactionId: transactions, action })
            });

            if (res.ok) {
                alert(`ดำเนินการ ${action} สำเร็จ!`);
                fetchPendingTasks(); // ดึงข้อมูลใหม่เพื่ออัปเดตรายการบนหน้าจอ (รายการที่ทำเสร็จแล้วจะหายไป)
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">รายการรออนุมัติแต้มขยะ</h1>
                
                {/* ตารางแสดงรายการข้อมูล (User, ประเภทขยะ, แต้ม) */}
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">ผู้ใช้งาน</th>
                            <th className="border p-2">ประเภทขยะ</th>
                            <th className="border p-2">แต้มที่จะได้รับ</th>
                            <th className="border p-2">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 6. Loop ข้อมูลจาก pendingTasks มาแสดงในแถวของตาราง */}
                        {pendingTasks.length > 0 ? (
                            pendingTasks.map((item) => (
                                <tr key={item._id} className="text-center">
                                    <td className="border p-2">{item.userId?.email || 'N/A'}</td>
                                    <td className="border p-2">{item.trashType}</td>
                                    <td className="border p-2 text-green-600 font-bold">{item.pointToReceive} 🪙</td>
                                    <td className="border p-2">
                                        <button onClick={() => handleAction(item._id, 'approve')} className="bg-green-500 text-white px-3 py-1 rounded mr-2 cursor-pointer">อนุมัติ</button>
                                        <button onClick={() => handleAction(item._id, 'reject')} className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer">ปฏิเสธ</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-4">ไม่มีรายการรออนุมัติ</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}