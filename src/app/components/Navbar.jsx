"use client"
import Link from 'next/link'
import { signOut, useSession }  from 'next-auth/react' 
import React, { useState, useEffect } from 'react';

function Navbar() {
  const { data: session } = useSession(); // ดึงข้อมูลผู้ใช้ที่ Login อยู่ (เช่น email, role)
  const [ userPoints, setUserPoints ] = useState(0); // State สำหรับเก็บแต้มของผู้ใช้เพื่อแสดงบน Navbar

  //  useEffect ทำหน้าที่ดึงแต้มล่าสุดจาก Database ทุกครั้งที่ข้อมูล session เปลี่ยนแปลง
  useEffect(() => {
    const fetchPoints = async () => {
      if (session?.user?.email){
        try {
          // ยิง API ไปที่ /api/getUserData เพื่อขอข้อมูลแต้มล่าสุดของผู้ใช้คนนี้
          const res = await fetch("/api/getUserData",{
            method: "POST",
            headers: {"content-type":"application/json"},
            body: JSON.stringify({email: session.user.email})
          });
          if(res.ok){
            const data = await res.json();
            // อัปเดตแต้มลงใน State เพื่อเอาไปแสดงผลใน UI
            setUserPoints(data.user?.points || 0);
          }
        } catch (error) {
          console.error("Error fetching points:", error);
        }
      }
    };
    fetchPoints();
  }, [session]);

  return (
    <nav className='bg-[#333] text-white p-6'> 
      <div className="container mx-auto">
        <div className='flex justify-between items-center'> 
            <div>
              {/*  แสดงชื่อโลโก้เฉพาะผู้ใช้ทั่วไป (Role: user) */}
              {session?.user?.role === "user" && (
                <Link href="/">Smart Waste</Link>
              )}
            </div>
            
            <ul className='flex '>
              {/* เงื่อนไข: ถ้ายังไม่ได้ Login ให้แสดงปุ่ม Sign In / Sign Up */}
              { !session ? (
                <>
                  <li className='mx-10'><Link href="/login">Sign In</Link></li>
                  <li className='mx-10'><Link href="/register">Sign Up</Link></li>
                </>
              ) : (
                /* เงื่อนไข: ถ้า Login แล้ว ให้แสดงเมนู My Account, แต้ม และปุ่ม Logout */
                <>
                  <li className='mx-10'>
                    <a href='/account' className='bg-gray-500 text-white border py-1 px-4 rounded-md text-lg my-2'>
                      My Account: {session?.user?.email}
                    </a>
                  </li>

                  {/* แสดงเมนูประวัติเฉพาะ Role: user เท่านั้น */}
                  {session?.user?.role === "user" && (
                    <li className='mx-10'>
                      <a href='/history' className='bg-green-500 text-white border py-1 px-4 rounded-md text-lg '>My History</a>
                    </li>
                  )}
                  
                  {/* แสดงแต้มที่ดึงมาจาก Database (userPoints) */}
                  <li className='mx-10'>
                    <a className='bg-green-500 text-white border py-1 px-4 rounded-md text-lg '>
                      My Points🪙: {userPoints}
                    </a>
                  </li>

                  {/* ปุ่ม Logout: เมื่อกดจะสั่งให้ Next-Auth เคลียร์ Session ทันที */}
                  <li className='mx-10'>
                    <a onClick={() => signOut()} className='bg-red-500 text-white border py-1 px-4 rounded-md text-lg my-2 cursor-pointer'>
                      Logout
                    </a>
                  </li>
                </>
              )}
            </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar