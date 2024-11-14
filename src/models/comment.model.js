import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { config } from "dotenv";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; //*this helps in aggregate pipeline writing and helps to show data in multiple data


config();

const commmentSchema = new Schema({
    // "id" generated automatically
    content:{
        type:String,
        required:true
    },
    video:{
       type:Schema.Types.ObjectId,
       ref:"Videodetail"
    },
    owner:{
       type:Schema.Types.ObjectId,
       ref:"userdetail"
    },



},
{timestamps:true}
)

commmentSchema.plugin(mongooseAggregatePaginate)

export const Comment=mongoose.model("Comment",commentSchema);


