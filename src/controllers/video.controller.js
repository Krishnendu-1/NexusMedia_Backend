import { Videodetail } from "../models/video.model.js";
import { ApiErrors } from "../utils/ApiError.js";
import { uploadVideoToCloudinary } from "../cloudnary/Cloudnary.js";

export const videoControlToUpload=async(req,res)=>{
    try {
        const videoPath=req.file.path;
        if(!videoPath) throw new ApiErrors(404,'no video found');
        const video= await uploadVideoToCloudinary(videoPath);
    
        const {title,VidDescription}=req.body;
        const newVideo=await Videodetail.create({
            video:video.url, //** the "video" is required to write the file name in the "key" section to get it successfull or will get error
            title,
            VidDescription,
            owner:req.user._id,

        });
        return res.status(200).json({message:'video uploaded successfully',videoDet:newVideo})
    } catch (error) {
        throw new ApiErrors('401','video not uploaded');
    }

}

export const getVideos=async(req,res)=>{
    try {
        //**without aggregation pipeline
        // const videos=await Videodetail.find().populate('owner','username email fullname');//The populate() method in Mongoose is used to automatically replace a field in a document with the actual data from a related document.
        
        //**with aggregation pipelines
        const videos=await Videodetail.aggregate([
            {
                $lookup:{
                    from:'users',
                    localField:'owner',
                    foreignField:'_id',
                    as:'owner'
                }
            }

        ]);
        console.log(videos);
        return res.status(200,'get videos done',videos);
    } catch (error) {
        throw new ApiErrors(403,'not get videos') 
    }

}