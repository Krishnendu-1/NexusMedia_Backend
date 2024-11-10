import { Schema } from "mongoose";
import mongoose from "mongoose";
import { config } from "dotenv";

config();
const userSubscriptionSchema= new Schema({//here "_id" automatically created 
    subscriber:{//its also a user who is subscribing
        type:Schema.Types.ObjectId,
        ref:'userdetail'
    },
    channel:{//its also a user to whom all are subscribing
        type:Schema.Types.ObjectId,
        ref:'userdetail'
    }
},{
    timestamps:true
})

export const Subscription=mongoose.model("Subscription",userSubscriptionSchema);