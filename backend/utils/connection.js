import mongoose from "mongoose";
export default function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("connected to db"))
    .catch((err)=>console.log("Error connecting to DB"))
}