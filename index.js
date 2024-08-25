import path from "path";
import express from "express"
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { v2 as cloudinary } from 'cloudinary'
import { app, server } from "./socket/socket.js";
import {fileURLToPath} from 'url'
import cors from "cors"
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path:path.join(__dirname, "/.env")});
connectDB();

const PORT=process.env.PORT||5000;

cloudinary.config({
    cloud_name:process.env.CloudINARY_CLOUD_NAME,
    api_key:process.env.CloudINARY_API_KEY,
    api_secret:process.env.CloudINARY_API_SECRET

})
app.use(cors())
app.use(express.json({limit:"80mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/messages',messageRoutes)
app.all('*', (req, res, next) => {
    res.send("In-valid Routing Plz check url  or  method")
})

server.listen(PORT,()=>console.log(`server startde at http://localhost:${PORT}`));