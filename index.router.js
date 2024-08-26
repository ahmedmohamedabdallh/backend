import connectDB from './db/connectDB.js'
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { v2 as cloudinary } from 'cloudinary'
import cookieParser from "cookie-parser";
const initApp = (app, express) => {
    cloudinary.config({
        cloud_name:process.env.CloudINARY_CLOUD_NAME,
        api_key:process.env.CloudINARY_API_KEY,
        api_secret:process.env.CloudINARY_API_SECRET
    
    })
    app.use(express.json({limit:"80mb"}))
    app.use(express.urlencoded({extended:true}));
    app.use(cookieParser());
    //Setup API Routing 
    app.use(`/users`,userRoutes)
    app.use(`/posts`,postRoutes)
    app.use(`/messages`,messageRoutes)
    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    connectDB()

}



export default initApp