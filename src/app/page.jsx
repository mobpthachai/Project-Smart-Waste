"use client"
import Navbar from "./components/Navbar";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {

  const {data: session} = useSession();

  return (
    
      <main >
        <Navbar session={session}/>
        <div className="container mx-auto">
          <h3  className="body">Smart Waste Management & Rewards</h3>
          <hr className="my-5"/>
          <p className="body2">เก็บขยะเพื่อสะสมแต้มไปแลกสิทธิพิเศษหรือของรางวัล</p>
          <div className="button-group">
            <Link href="/dropoff">
          <button className="body3 cursor-pointer" >เเลกพอยต์ ( Points ) </button>
            </Link>
            <Link href="/rewards">
          <h1 className="body4">เเลกรางวัล ( Rewards) </h1>
          </Link>
          </div>
        </div>
      </main>
  );
}
