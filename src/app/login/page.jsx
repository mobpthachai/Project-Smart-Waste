"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession();

  // ส่วนควบคุมการเปลี่ยนหน้าอัตโนมัติ (Role-based Redirection)
  useEffect(() => {
    if (session) {
      // ตรวจสอบ Role จากฐานข้อมูลผ่าน Session
      if (session.user.role === "admin") {
        router.replace("/admin/admin-dashboard"); // ถ้าเป็น Admin ส่งไปหน้าจัดการ
      } else {
        router.replace("/"); // ถ้าเป็น User ปกติส่งไปหน้าแรก
      }
    }
  }, [session, router]);

  // แสดงข้อความระหว่างระบบกำลังตรวจสอบสถานะ Login
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // ฟังก์ชันจัดการการ Login เมื่อกดปุ่ม Sign In
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // เรียกใช้ Next-Auth signIn โดยใช้ Credentials (Email/Password)
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // ปิดการเปลี่ยนหน้าอัตโนมัติเพื่อให้เราจัดการ Logic เองด้านบน
      });

      if (!res.ok) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง❌");
        return;
      }
      
      // บังคับรีโหลดเพื่ออัปเดตสถานะ Session ล่าสุด
      window.location.reload();

    } catch (error) {
      console.log(error);
      setError("เกิดข้อผิดพลาด❌");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="display1">
        <h3>Login Page</h3>
        <hr className="my-3" />

        <form onSubmit={handleSubmit}>
          {/* ส่วนแสดงข้อความแจ้งเตือนเมื่อรหัสผ่านผิด */}
          {error && (
            <div className="display1 bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          {/* ช่องกรอกข้อมูลรับค่า Email และ Password */}
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="textinput1"
            type="email"
            placeholder="Enter your email"
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            className="textinput1"
            type="password"
            placeholder="Enter your password"
          />
          <button type="submit" className="bg-green-600 p-2 rounded-md text-white cursor-pointer"> Sign In</button>
          
        </form>

        <hr className="my-3" />

        <p>
          Don't have an account? go to{" "}
          <Link className="text-blue-500 hover:underline" href="/register">Register</Link>{" "}
          Page
        </p>
      </div>
    </div>
  );
}

export default LoginPage;