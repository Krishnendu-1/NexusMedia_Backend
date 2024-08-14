export const asyncHandler=(RequestHandler)=>(err,req,res,next)=>{//higher order funtion-->taking function as params
    Promise.resolve(
        RequestHandler(err,req,res,next)//calling that function-->with advanced params
    ).catch((err)=>{
        next(err)
    })

}