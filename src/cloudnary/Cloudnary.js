import { v2 as cloudinary} from "cloudinary";
import fs from 'fs' //linking and unlinking of local files given by "node.js" by default.
import { config } from "dotenv";

config();
//*Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDNARY_NAME, 
    api_key: process.env.CLOUDNARY_API_KEY, 
    api_secret:process.env.CLOUDNARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

   export const uploadToCloudinary=async (localpath)=> {
      
        try{
            if(!localpath) return null;
            //* Upload an image
        const uploadResult= await cloudinary.uploader.upload(localpath, {resource_type:"auto" });
           console.log("file uploaded",uploadResult.url);
           fs.unlinkSync(localpath);
           return uploadResult;
        } catch(error){
           fs.unlinkSync(localpath);//remove locally saved file as the upload operation got failed
           console.log(error);
           return null;
       };
    
   
    // // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });
    
    // console.log(optimizeUrl);
    
    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto',
    //     width: 500,
    //     height: 500,
    // });
    
    // console.log(autoCropUrl);    

    }
