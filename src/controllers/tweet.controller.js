import { tweet } from "../models/tweet.model.js";
import { ApiErrors } from "../utils/ApiError.js";

export const tweetUpload=async (req,res)=>{
    try{
        const {content}=req.body;
        if(!content) throw new ApiErrors(400,'content is required');
        const newTweet= await tweet.create({
            content,
            owner:req.user._id
        })

        return res.status(200).json({message:'tweet uploaded successfully',TweetDetail:newTweet})



    }catch(err){
        throw new ApiErrors(401,'problem while uploading tweets');
    }
}