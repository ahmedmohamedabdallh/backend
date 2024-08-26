import mongoose from "mongoose";

const connectDB  = async ()=>{
    return await mongoose.connect(process.env.MONGO)
    .then(res=>console.log(`DB Connected successfully on .........`))
    .catch(err=>console.log(` Fail to connect  DB.........${err} `))
}


export default connectDB
