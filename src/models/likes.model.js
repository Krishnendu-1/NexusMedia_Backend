import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { config } from "dotenv";

//*N:B:-⭐here no need of aggregate paginate as we dont want to show in different pages or use aggregation pipeline
//import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; //*this helps in aggregate pipeline writing and helps to show data in multiple data


config();

const likesSchema = new Schema({
    // "id" generated automatically
    video:{
       type:Schema.Types.ObjectId,
       ref:"Videodetail"
    },
    likedBy:{
       type:Schema.Types.ObjectId,
       ref:"userdetail"
    },
    comment:{
       type:Schema.Types.ObjectId,
       ref:"Comment"
    },
    
    tweet:{
       type:Schema.Types.ObjectId,
       ref:"Tweet"
    },
   
    

 

},
{timestamps:true}
)


//*⭐N:B:-below is required or worked only if the aggregate paginate is used to the model
// likesSchema.plugin(mongooseAggregatePaginate)

export const likes=mongoose.model("likes",likesSchema);



