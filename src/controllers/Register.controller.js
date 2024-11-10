import { ApiErrors } from "../utils/ApiError.js";
import { userdetail } from "../models/user.model.js";
import { uploadToCloudinary } from "../cloudnary/Cloudnary.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { config } from "dotenv";
import jwt from 'jsonwebtoken'
import mongoose, { mongo } from "mongoose";

config();
const generateAccessAndRefreshToken = async(userID)=>{
   
   try{
    const user=await userdetail.findById(userID);
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

//saving refresh token only in data base 
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false})
    return {accessToken,refreshToken}

}catch(err){
    throw new ApiErrors(505,"Server error");

}

}

//**⭐very complex async function⭐ */
/*import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser=asyncHandler( async (req,res)=>{ //*"asyncHandler(async()=>{})" it takes function and implement "promises"
    console.log('Request received:', req.body);
    res.status(200).json({
        message: "ok"
    })
})

export default registerUser;*/

//**very easy async function */
const registerUser = async (req, res) => {

    //*ONLY FOR TESTING PURPOSES */
    /* try {
        console.log('Request received:', req.method);  // Log the request body
        res.status(200).json({
            message: "OK"
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: "Server Error"
        });
    }*/


    //*⭐⭐<--LOGIC BUILDING Algorith-->⭐⭐*/
    /*
    1. GET USER DATA FROM FRONTEND
    2. VALIDATION-NOT EMPTY
    3. CHECK USER ALREADY EXISTS
    4. CHECK AVATAR
    5. UPLOAD IMG,AVATAR TO CLOUDINARY
    6. CREATE USER OBJECT IN DB
    7. REMOVE PASSWORD AND REFRESH TOKEN FROM RESPONSE TO FRONTEND
    8. CHECK USER CREATION
    9. RETURN RES
*/


    const {username,email,fullname,password} = req.body //*destructuring the "models" to the "request body".
    console.log(email);

    //* Unprofessional code check*/
    /*if( fullname === ""){
        throw new ApiErrors(400,"required")
    }*/

    //*Professional code//
    if ([username,email,fullname,password].some((field)=>//"some()" will always give true or false-->very advanced code
        field?.trim()==="")) {// return "true" if blank is there even after trimming or return "false"
            throw new ApiErrors(404,"required")
        
    }

    const existedUser= await userdetail.findOne(//to check using "await" ,existed user. As database fetching require time, thats why we always use "await"
        {   //syntex to check multiple objects using "or" operator
            $or:[{username},{email}]
        }
    )

    if(existedUser){
        throw new ApiErrors(409,'user exists')
    }

    console.dir(req.files);
    //*req.files... here "files" is used since here we are uploading avatar & coverimage through single function. If not uploading two files simultaneously, then use "req.file.path"-->file path will be accecpted to multer for that one file.
    const avatarPath= req.files?.avatar[0]?.path;//using optional "?" to access files "path" property under [0]th object index(eg, avatar:[{0th object}]) of "avatar" array, from "Multer" as it stores in ".photo/temp" first before sending it to cloudinary
    
    //*it is showing undefined (reading '0') error if cover image is not selected
    //const coverImagePath=req.files?.coverImage[0]?.path;

    //classic way to handle coverImage problem
    let coverImagePath;
    if(req.files && Array.isArray(req.files.coverphoto) && req.files.coverphoto.length>0){
        coverImagePath=req.files.coverphoto[0].path;
    }

    if(!avatarPath){
        throw new ApiErrors(400,"Avatar needed");
    }

    const avatar=await uploadToCloudinary(avatarPath);
    const coverphoto=await uploadToCloudinary(coverImagePath);

    if(!avatar) throw new ApiErrors(400,"avatar needed");

   const User= await userdetail.create(
        {
            fullname,
            avatar:avatar.url,
            coverphoto:coverphoto?.url || "",
            username:username.toLowerCase(),
            email,
            password
        })

    //* this is very advanced code to find "User" by "_id" provided by MongoDB and also diselect "password " and "refreshToken" using "select()" method by its weird syntax.
        const createdUser= await userdetail.findById(User._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) throw new ApiErrors(500,"something went wrong in registration");


    //*⭐Standard way to return response in json format⭐
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successsfully")
    )



};

const loginUser= async (req,res) => {
    //*Logic for Login
    /*
    1. req.body->data
    2. username or email based login
    3.find the user
    4.password check
    5. access and refresh token
    6.send it as cookies
    7. sucessful login

    */
   //*1st step
   const {email,username,password} = req.body; //* always get data from request body

   if(!(username || email)){//not use like that-->(!username || !email)
    throw new ApiErrors(400,"Username or Email required");
   }

   const existedUser= await userdetail.findOne(//to check using "await" ,existed user. As database fetching require time, thats why we always use "await"
    {   //syntex to check multiple objects using "or" operator, they are mongoDB operators
        $or:[{username},{email}]
    })
//*⭐"existedUser" is the "instance" of saved DataBase data of main "userdeatil" mongoose object model, all req.body data, methods created through mongoose all are stored in "existedUser" ⭐  
if(!existedUser){
        throw new ApiErrors(404,"User not exists");
    }

    const correctPassword= await existedUser.isPasswordRight(password);
    if(!correctPassword){
        throw new ApiErrors(404,"password not valid");
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(existedUser._id);

    const loggeduser=await userdetail.findById(existedUser._id).select(" -password -refreshToken")//this refreshToken is mongoose object created with same name

    //cookies
    const options={
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)//res.cookie("⭐AccessToken",AccessToken,options)...the "⭐AccessToken" is used for future "logout" not normal AccessToken 
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(200,
            {
                user:loggeduser,
                accessToken,
                refreshToken
            },
            "user logged successfully"
            
        )
    )

}

const logout= async(req,res)=>{
    await userdetail.findByIdAndUpdate( //this method can be used as same to update text based update like -> name,email etc
        req.user._id,
        {
            $set:{
                refreshToken: undefined,//this removes the field from document......
                //*better approach------->
                /* $unset:{
                    refreshToken:1//this "unset" the "refreshtoken" when it goes to logout
                 }*/
            },
            
        },
        {
            new:true//it will return after udating the values
        }
    )
    const options={
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"user logged out")
    )

}



const refreshtheAccesstoken=async(req,res)=>{
    const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken;//* "req.cookies.refreshToken" for accessing refresh token from "laptops" and "req.body.refreshToken" for mobiles
    if(!incomingRefreshToken) {
        throw new ApiErrors(404,"Refresh token is required");
    } 

    try { 
        const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.SECRET_REFRESH_TOKEN);
        const user = await userdetail.findById(decodedRefreshToken._id);//*"_id" is used as i have given it while creating refresh and access token
        if(!user) {
            throw new ApiErrors(404, "User not found");
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiErrors(404, "refresh token expired");
        }
    
        const options={
            httpOnly: true,
            secure: true
        }
    
        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);//return from the function
        return res
        .status(201)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(200,{
                accessToken: accessToken,
                refreshToken: refreshToken,
            },"Access token successfully refreshed")
            )
    } catch (error) {
        throw new ApiErrors(400,error.message || "Problem while refreshing access token");
        
    }



    


     
}

//*Important:text update
const changeUserpassword=async(req,res)=>{
    const {oldpassword,newpassword,confrmpassword}=req.body;

    if(!(newpassword ===confrmpassword)) {
        throw new ApiErrors(400,"two passwords should be same")
    }

    const user=await userdetail.findById(req.user?._id)//as I have declared "user" in "req.user" for verify auth middleware
    const passwordRightorNot=await user.isPasswordRight(oldpassword);
    if(!passwordRightorNot){
        throw new ApiErrors(403,"old password is not correct");

    }

    user.password=newpassword;//we have model object namely "password" where the new password is set.
    await user.save({validateBeforeSave:false})//before saving to database it will "hash" and and to save password not anything else, we're using "validateBeforeSave:false" .

    return res
    .status(201)
    .json(
        new ApiResponse(200,{},"password changed")
    )

}


const getuser=async (req,res)=>{
    return res.status(200).json(
        new ApiResponse(201,req.user,"user fetched successfully")//easy to get current user, as in the verify auth middleware , full user is put into "req.user"
    )
}



//*Information update
const InfoUpdate=async (req,res)=>{
    const {fullname,email}=req.body;

    if(!fullname && !email){
        throw new ApiErrors(404,"fullname and email both are required");
      
        
    }

    const updatedInfo=await userdetail.findByIdAndUpdate(
        req.user?._id,//full user data is stored in req.user in the verify auth
        {
            $set:{
                fullname:fullname,
                email:email
            }
        },{
            new:true//it will always return after changes, so the whole function need to be stored in variable.
        }
    ).select("-password")//updating without any change in password

    return res.status(200).json(
        new ApiResponse(200,updatedInfo,"all fields are updated")
    )
}

//*Important: file update⭐⭐⭐
const AvatarUpdate=async (req,res)=>{
    //*req.files... here "files" is used since here we are uploading avatar & coverimage through single function. If not uploading two files simultaneously, then use "req.file.path"-->file path will be accecpted to multer for that one file.
    const avatarLocal=req.file?.path;
    if(!avatarLocal){
        throw new ApiErrors(400,"file path issue");
    }

    const uploadLocalPath= await uploadToCloudinary(avatarLocal);
    if(!uploadLocalPath.url){
        throw new ApiErrors(400,"file upload issue");
    }

    //*after setting the new image to local file to cloudinary , now below function to add the url to the database
    const updatedAvatar=await userdetail.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
            avatar:avatar.url
            }
        },
        {
            new:true,
        }
    ).select("-password")
    
    res.status(200).json(
        new ApiResponse(
            200,
            updatedAvatar,
            "avatar updated successfully"
        )
    )
    

}
const CoverimageUpdate=async (req,res)=>{
    //*req.files... here "files" is used since here we are uploading avatar & coverimage through single function. If not uploading two files simultaneously, then use "req.file.path"-->file path will be accecpted to multer for that one file.
    const coverimageLocal=req.file?.path;
    if(!coverimageLocal){
        throw new ApiErrors(400,"file path issue");
    }

    //it is uploaded to local and coludinary...we've now our url also
    const uploadLocalPath= await uploadToCloudinary(coverimageLocal);
    if(!uploadLocalPath.url){
        throw new ApiErrors(400,"file upload issue");
    }

    //*after setting the new image to local file to cloudinary , now below function to add the url to the database
    const updatedcoverimage=await userdetail.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
            coverphoto:coverphoto.url
            }
        },
        {
            new:true,
        }
    ).select("-password")
    
    res.status(200).json(
        new ApiResponse(
            200,
            updatedcoverimage,
            "cover image updated successfully"
        )
    )
    

}


//*⭐❗Important:very advanced code of MongoDB aggregation pipeline⭐⭐*
const getUserSubscriptionDetails=async (req,res)=>{
    const {username}=req.params;//channel will always get(we go to channel like -->youtube.com/chaiaurcode, here "chaiaurcode" is username) in form of url , from there we have taken username...not from req.body
    if(!username?.trim()){
        throw new ApiErrors(404,"username is required");
    }

    //easy way to find "documents"-->discussed in notes.md
   // await userdetail.find({username});

   //*Advanced
   //below "channel" variable will store array which is returned by "aggregate()"
   const channel=await userdetail.aggregate([
    //1st pipeline
    {
    $match:{
        username:username?.toLowerCase()//will get only "one" object as we're matching channel username 
    }
   },
    //2nd pipeline
   {
    $lookup:{
        from:"subscriptions", //*"Subscription" is written here but for matching and lookup in database documents, it was converted to all small letters and adding "s" at last. So we ahve also written "Subscription" to "subscriptions"
        localField: "_id",
        foreignField:"channel",
        as:"subscribers"
    }
   },
    //3rd pipeline
{
    $lookup:{
        from:"subscriptions", 
        localField: "_id",
        foreignField:"subscriber",
        as:"subscribedTo"//to whom the channel has followed, like-->I followed his channel and he followed to how many channel
    }
},
 //4th pipeline
//adding two extra fields from subscription model and having the count in the "user" model by aggregation.
{
    $addFields:{
        subscriberCount:{
            $size:"$subscribers" //to count number of ⭐"as:"subscribers""" and "$" is used becuase now "subscribers" is now a "field"
        },
        subscribedTocount:{
            $size:"$subscribedTo"//to count number of ⭐"as:"subscribedTo"" using "$size" and "$" is used becuase now "subscribedTo" is now a "field" 
        },
        isSubscribed:{
            $cond:{
                if:{
                    $in:[req.user?._id,"$subscribers.subscriber"]//*⭐⭐"$in" used to find "req.user?._id" is present in "subscriber" model within "$subscribers" field.
                },
                then:true,
                else:false
            }
        }
    }
},
//5th pipeline
{
    $project:{//which fields i want to show to reduce network traffic
        fullname:1,
        username:1,
        subscriberCount:1,
        subscribedTocount:1,
        isSubscribed:1,
        email:1,
        avatar:1,
        coverphoto:1


    }
}
])

console.dir(channel);
 
if(!channel?.length){
    throw new ApiErrors(400,"channel doesnt exist");
}

return res.status(200).json(new ApiResponse(201,channel[0],"user channel fetched"))

}


const getUserWatchHistory=async (req,res)=>{
    const user=userdetail.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user?._id)
            },
            
        },
        //*sub pipelines-->complex and advanced
        {
            $lookup:{
                from:"videodetails",//*"Subscription" is written here but for matching and lookup in database documents, it was converted to all small letters and adding "s" at last. So we ahve also written "Subscription" to "subscriptions"
                localField:"watchHistory",//then the owner details is stored here
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"userdetails",//searching in the "userdetail" 
                            localField:"owner",//current field where to find in video schema...after lookup, here returned array will be stored
                            foreignField:"_id",//_id of the userdetail schema in video schema
                            as:"owner",//give it any name...mostly same as localField name
                            pipeline:[
                                {
                                    $project:{//as we seen in watch history, giving it to frontend 
                                        fullname:1,
                                        avatar:1,
                                        username:1
                                    }
                                }
                            ]
                        }
                    },
                    //adding "owner" field as new one to "owner"....though it is extra work, if i give full owner array to frontend it is ok. Throgh this new "owner" field is added.
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"//first object ...[0]
                            }
                        }
                    }
                ]

            
            }
        }
    ]);

    return res.status(201).json(new ApiResponse(200,user[0].watchHistory,"watch history fetched successfully"))
}

export { 
    registerUser,
    loginUser,
    logout,
    refreshtheAccesstoken,
    changeUserpassword,
    getuser,
    AvatarUpdate,
    CoverimageUpdate,
    InfoUpdate,
    getUserSubscriptionDetails,
    getUserWatchHistory
}
