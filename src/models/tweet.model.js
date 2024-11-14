import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { config } from "dotenv";


config();

const tweetSchema = new Schema({
    // "id" generated automatically
    content:{
        type:String,
        required:true
    },
    owner:{
       type:Schema.Types.ObjectId,
       ref:"userdetail"
    },



},
{timestamps:true}
)


export const tweet=mongoose.model("tweet",tweetSchema);


