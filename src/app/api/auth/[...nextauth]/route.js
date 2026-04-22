import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"; 
import connectMongoDB from "@/lib/mongodb";
import User from "../../../../models/user";
import bcrypt from 'bcryptjs' 

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials) { //ฟังก์ชันหลักในการตรวจสอบสิทธิ์ (Check Login)
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          // หาผู้ใช้ใน MongoDB ด้วย Email
          const user = await User.findOne({ email });
          if (!user) return null; // ถ้าไม่เจอ user ให้ส่งค่าว่างกลับ (ล็อกอินไม่ผ่าน)

          // เปรียบเทียบรหัสผ่านที่ส่งมากับรหัสใน Database (ที่ผ่านการ Hash แล้ว)
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) return null;

          // ถ้าผ่าน! ส่งข้อมูลพื้นฐานที่จำเป็นไปเก็บไว้ใน "บัตรผ่าน" (Token)
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role, // เก็บตำแหน่ง (เช่น admin/user) ไว้ใช้แยกสิทธิ์
          };

        } catch (error) {
          console.log("error:", error);
          return null;
        }
      }
    })
  ],

  callbacks: {
    //จังหวะสร้าง Token: เอาข้อมูลจาก authorize มาใส่ไว้ใน JWT (Token ดิจิทัล)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    //จังหวะสร้าง Session: ดึงข้อมูลจาก Token มาแสดงในหน้าเว็บ (ให้ useSession() เรียกใช้ได้)
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        role: token.role,
      };
      return session;
    }
  },

  session: {
    strategy: "jwt", // ใช้ JSON Web Token ในการเก็บสถานะการล็อกอิน
  },

  secret: process.env.NEXTAUTH_SECRET, // กุญแจลับสำหรับเข้ารหัสข้อมูล (อยู่ในไฟล์ .env)

  pages: {
    signIn: "/login" // กำหนดให้ถ้ายังไม่ได้ล็อกอิน แล้วจะเข้าหน้าที่ต้องใช้สิทธิ์ ให้เด้งไปหน้า /login
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };