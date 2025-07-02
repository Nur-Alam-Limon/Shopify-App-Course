import mongoose from "mongoose";


let isDbConnected = false;

const connectDB = async()=>{
  if(isDbConnected) return;
  try{
    await mongoose.connect(process.env.DB_URL, {});
    isDbConnected = true;
    console.log("Mongo Connected Successfully");
  }catch(err){
    throw new Error("Failed Mongo connection", err);
  }
}

export default connectDB;
