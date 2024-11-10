//DB asynchrounous code

const asyncHandler=(RequestHandler)=>{
    //*⭐"return" is important as we accept function as params and return it also so that we can use in "registerUser"
    return (err,req,res,next)=>{//higher order funtion-->taking function as params
    Promise.resolve(
        RequestHandler(err,req,res,next)//calling that function-->with advanced params
    ).catch((err)=>{
        next(err)
    })

}}

export {asyncHandler};