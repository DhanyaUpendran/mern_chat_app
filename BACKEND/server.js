import express from "express";
 import dotenv from "dotenv";
 import cookieParser from "cookie-parser";
 import authRoutes from "./routers/auth.route.js";
 import messageRoutes from "./routers/message.route.js";
 import userRoutes from "./routers/user.route.js";
 import connectToMongoDB from "./db/connectToMongoDB.js";
dotenv.config();
const app = express();
const port= process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("hello");
})
app.use("/api/auth",authRoutes)  
app.use("/api/messages",messageRoutes) 
app.use("/api/users/",userRoutes)


app.listen(5000,()=>{
    connectToMongoDB();
    console.log("MongoDB URI:", process.env.MONGO_DB_URI);
console.log(`server running on port ${port}`)
}); 