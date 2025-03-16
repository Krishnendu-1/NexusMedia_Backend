export const healthCheck=async (req,res)=>{
    try{
        return res.status(200).json({message:'the server is running fine',status:201})
    }catch(err){
         throw new Error.message;
        
    }
}