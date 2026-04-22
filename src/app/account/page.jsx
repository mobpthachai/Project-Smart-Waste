"use client"
import React from 'react'
import Navbar from '../components/Navbar'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function WelcomePage() {
    // ดึงข้อมูลผู้ใช้ (session) และสถานะการโหลด (status) มาใช้งาน
    const {data: session, status} = useSession();
    const router = useRouter();
    console.log(session)

    useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session]);

  

  if (!session) return null;


  return ( 
    <div>
            {/* ส่งข้อมูล session ไปให้ Navbar เพื่อแสดงชื่อหรือสถานะผู้ใช้ */}
            <Navbar session ={session}/>
            
            <div className='container mx-auto'>
                {/* ดึงข้อมูลชื่อและอีเมลจาก session มาแสดงผลบนหน้าจอ */}
                <h3 className='text-3xl my-3'>Welcome {session?.user?.name}</h3>
                <p>Email: {session?.user?.email}</p>
                <hr className='my-3'/>
            </div>
        </div>
    )
}
export default WelcomePage

//หน้า "ยินดีต้อนรับ" ที่ถูกล็อกไว้ให้เฉพาะคนที่ล็อกอินแล้วเท่านั้นถึงจะเห็นข้อมูลของตัวเองได้