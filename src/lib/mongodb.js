import mongoose from 'mongoose'

//ใช้เชื่อมต่อกับฐานข้อมูล
export const connectMongoDB = async () => {
    try{
        // คำสั่งเชื่อมต่อฐานข้อมูล โดยใช้ URI (ที่อยู่ฐานข้อมูล) จากไฟล์ .env
        await mongoose.connect(process.env.MONGODB_URI);
        family: 4,
        console.log("Connected to MongoDB");
    }catch(error){
        console.log("Error connecting to MongoDB: ",error);
    }
}
// ส่งออกฟังก์ชัน connectMongoDB เป็นค่าเริ่มต้น เพื่อให้ไฟล์อื่นๆ (เช่น API) เรียกใช้ได้
export default connectMongoDB;