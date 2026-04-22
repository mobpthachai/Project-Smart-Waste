"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'
import Link from 'next/link';
import { useSession } from 'next-auth/react';

function RegisterPage() {
  // 1. สร้าง States สำหรับเก็บข้อมูลฟอร์ม และข้อความแจ้งเตือน (Error/Success)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: session, status } = useSession();

  //  ถ้าผู้ใช้ล็อกอินค้างไว้อยู่แล้ว ไม่ให้เข้าหน้าสมัครสมาชิก (เตะไปหน้า Welcome)
  useEffect(() => {
    if (session) {
      router.push("/welcome");
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // ฟังก์ชันหลักเมื่อกดปุ่ม Sign Up
  const handleSubmit = async (e) =>{
    e.preventDefault();

    //  ตรวจสอบความถูกต้องเบื้องต้น (Frontend Validation) ---
    if(password != confirmpassword){
      setError("password do not match!❌")
      return;
    }
    if (!name || !email || !password || !confirmpassword){
      setError("โปรดใส่ข้อมูลทั้งหมด")
      return;
    }

    try {
      // เช็กว่าอีเมลนี้มีคนใช้หรือยัง (Check Existing User) ---
      // โดยการยิงไปที่ API checkUser ที่เราดูไปก่อนหน้านี้
      const resCheckUser = await fetch("http://localhost:3000/api/checkUser",{
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ email })
      })

      const { user } = await resCheckUser.json();

      if(user){
        setError("User already exists!❌") // ถ้าเจอ User ใน DB ให้หยุดทำงานทันที
        return;
      }
      
      // ส่งข้อมูลไปบันทึกลง MongoDB (Actual Registration) ---
      const res = await fetch("http://localhost:3000/api/register",{
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ name, email, password })
      })

      if (res.ok) {
        const form = e.target;
        setError("");
        setSuccess("User registration Successfully🎉") // แจ้งสำเร็จ
        form.reset(); // ล้างข้อมูลในฟอร์ม
      } else {
        console.log("user registration failed❌.")
      }

    } catch(error) {
      console.log("Error during registration", error);
    }
  }

  return (
    <div>
      <Navbar />
      <div className='display1'>
        <h3>Register Page</h3>
        <hr className='my-3'/>
        <form onSubmit={handleSubmit}>

          {/* ส่วนแสดงข้อความ Error (สีแดง) */}
          {error && (
            <div className='display1 bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
              {error}
            </div>
          )}

          {/* ส่วนแสดงข้อความ Success (สีเขียว) */}
          {success && (
            <div className='display1 bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
              {success}
            </div>
          )}

          {/* Input Fields พร้อม onChange เพื่อเก็บค่าลง State */}
          <input onChange={(e) => setName(e.target.value)} className='textinput1' type="text" placeholder='Enter your name'/>
          <input onChange={(e) => setEmail(e.target.value)} className='textinput1' type="email" placeholder='Enter your email'/>
          <input onChange={(e) => setPassword(e.target.value)} className='textinput1' type="password" placeholder='Enter your password'/>
          <input onChange={(e) => setConfirmPassword(e.target.value)} className='textinput1' type="password" placeholder='Confirm your password'/>
          
          <button type='submit' className='bg-green-600 p-2 rounded-md text-white cursor-pointer'>Sign Up</button>
        </form>
        <hr className='my-3'/>
        <p>Already have an account? go to <Link href="/login">Login</Link> Page</p>
      </div>
    </div>
  )
}

export default RegisterPage