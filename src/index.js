import { app } from "./app.js";
import { config } from "dotenv";//if .env placed in root folder(in this case) then only env varialbles can be accssed through loading "config()" this
//if not then --> import dotenv from 'dotenv'
//dotenv.config({path:'./ENV/env'})-->if "env" file is in another folder, then its necessary
import { connectDB } from "./db/db.js";

config();//load is very important form .env file
connectDB().then(()=>{
    app.on('error',(error)=>{
        console.log(`FAILED: ${error}`);
        throw error;
    })
    app.listen(process.env.PORT,()=>{
        console.log(`http://localhost:${process.env.PORT || 3000}`)
    })
}).catch((error)=>{
    console.log("error",error)
})














//First approach-->easy one
/*
import express from "express"
const app=express();

;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_name}`)
        app.on("error",(error)=>{//listeners ...used to find whether express is connected to mongodb or not
            console.log("Error: ",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("MongoDB connection error: ",error);
        throw error
    }

})()        */