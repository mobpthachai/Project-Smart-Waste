"use client"
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function Home() {

  return (
    //แสดงแถบเมนูด้านบนของหน้า Admin
      <main >
        
        <Navbar />
        <div className="container mx-auto">
          <h3  className="body">Admin Managements</h3>
          <h3  className="body">Smart Waste Management & Rewards</h3>
          <hr className="my-5"/>
          <p className="body2">หน้าต่าง Admin </p>
          <div className="button-group">
            <Link href="/admin/manage-waste">
          <button className="body3">Manage-Waste </button>
            </Link>
            <Link href="/admin/manage-rewards">
          <h1 className="body4">Manage-Rewards </h1>
          </Link>
          </div>
        </div>
      </main>
  );
}