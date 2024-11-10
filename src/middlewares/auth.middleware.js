import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
import { ApiErrors } from '../utils/ApiError.js';
import { userdetail } from '../models/user.model.js';

config();
const verifyJWT = async(req,res,next)=>{
    try{//**the "AccessToken" is taken from res.cookie("⭐accessToken",accessToken,options)...the "⭐accessToken" is used not normal accessToken */
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiErrors(404,"invalid request");
        }
        const decodedToken= jwt.verify(token,process.env.SECRET_ACCESS_TOKEN)
        const user=await userdetail.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
    
            throw new ApiErrors(400,"Access token error");
    
        }
        req.user=user;
        next();//it is used to pass power to next process
    }catch(err){
        throw new ApiErrors(400,"error")
    }
   
} 

export {verifyJWT}