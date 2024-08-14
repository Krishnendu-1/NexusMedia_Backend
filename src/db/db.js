import mongoose from "mongoose";
import { config } from "dotenv";
import { DB_name } from "../constant.js";//always type .js for importing any js file to aviod error

config();//always load the variables from .env file through "config"
export const connectDB= async ()=>{
    try{
        const DB_instance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_name}`);
        console.log(`DB connected at: ${DB_instance.connection.host}`);
    }
    catch(error){
        console.log(`Connection error FAILED! ${error.message}`);
        process.exit(1);
    }
}