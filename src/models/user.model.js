import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { config } from "dotenv";

config();
const userschema=new Schema({
    username:{
        type:String,
        required:true,
        index:true, // to make any field searchable in DB
        unique:true, 
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//cloudnary url
        required:true,
    },
    coverphoto:{
        type:String,//cloudnary url
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Videodetail"
         
        }
    ],
    //*these two are very important to understand....take notes*//
    password:{
        type:String,
        required:[true,"Password is important"]
    },
    refreshToken:{
        type:String
    }

    
},{timestamps:true});

//mongoose hooks-->"pre" to encrypt password just before saving data in mongoDB
userschema.pre('save',async function(next){//the "()=>{ }" is not used here as "this." cant be used there so we used normal "fuction(){}" method
    if(!this.isModified("password")) return next();//if field is not modified then go to "next()"
    this.password= await bcrypt.hash(this.password,10);
    next();
})

//to create my custom methods 
userschema.methods.isPasswordRight=async function(password) {
    return await bcrypt.compare(password,this.password);//*"password" is user given and "this.password" is saved in mongoDB
}

userschema.methods.generateAccessToken= function() {
    return jwt.sign({
        _id:this._id,//from mongoDB
        email:this.email,//from mongoDB
        username:this.username,
        fullname:this.fullname,
        
    },process.env.SECRET_ACCESS_TOKEN,
{
    expiresIn:process.env.EXPIRY_ACCESS_TOKEN,
})
}

userschema.methods.generateRefreshToken= function() {
    return jwt.sign({//jwt.sign is used to create json web tokens
        _id:this._id,//from mongoDB
    },
    process.env.SECRET_ACCESS_TOKEN,
    {
    expiresIn:process.env.EXPIRY_ACCESS_TOKEN,
    })

}

export const userdetail=mongoose.model("userdetail",userschema);