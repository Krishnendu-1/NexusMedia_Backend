import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { config } from "dotenv";


config();

const playlistSchema = new Schema({
    // "id" generated automatically
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    videos:[
        {
       type:Schema.Types.ObjectId,
       ref:"Videodetail"
    }
    ],
    owner:{
       type:Schema.Types.ObjectId,
       ref:"userdetail"
    },



},
{timestamps:true}
)


export const Playlist=mongoose.model("Playlist",playlistSchema);


