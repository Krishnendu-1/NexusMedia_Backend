import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; //this helps in aggregate pipeline writing and helps to show data in multiple data

const videoschema=new Schema({
    video:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true

    },
    VidDescription:{
        type:String,//cloudnary url
        required:true

    },
    Duration:{
        type:Number,//from cloudnary feature

    },
    view:{
        type:Number,//from cloudnary feature
        default:0,
        

    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'userdetail'
    },

},{timestamps:true})



videoschema.plugin(mongooseAggregatePaginate)//*⭐ aggregation pipeline-->important topic Do read
//now we can write aggregate queries in mongoDB

export const Videodetail=mongoose.model('Videodetail',videoschema);