// import { Router } from "express";
// import  registerUser  from "../controllers/Register.controller.js";
// const router=Router();

// router.route("/register").post(registerUser);

// export default router;


import { Router } from "express";
import  {registerUser,loginUser, logout, changeUserpassword, getuser, InfoUpdate, AvatarUpdate, CoverimageUpdate, getUserSubscriptionDetails, getUserWatchHistory }  from "../controllers/Register.controller.js";
import { uploadImage,uploadVideo } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { refreshtheAccesstoken } from "../controllers/Register.controller.js";
import { videoControlToUpload,getVideos } from "../controllers/video.controller.js";

const router = Router();

router.post('/register', 
    
    uploadImage.fields([//* fields is an array,used to store "different" "fields".
        {
            name: 'avatar',
            maxCount:1
        },
        {
            name: 'coverphoto',
            maxCount:1
        }
    ]),
    
    //*👆🏻👆🏻👆🏻middleware just before main controllers in a route

    registerUser);

    

router.post('/login',loginUser)


  
//*secured routes-->user is looged in
//verifyJWT is middleware used here
router.post('/logout', verifyJWT ,logout);
router.post('/refreshAccessToken',refreshtheAccesstoken);
router.post("/passwordUpdate",verifyJWT,changeUserpassword);//if verified as login then only can change password
router.get("/cuurentUser",verifyJWT,getuser);//if logged in then only see the "user"
router.patch("/detailsUpdate",verifyJWT,InfoUpdate);//"patch" used to prevent from all user detail update in "post" method
router.patch("/avatarUpdate",verifyJWT,uploadImage.single("avatar"),AvatarUpdate);//only "single" file update and can be updated only if logged in ...here two middlewares are used...very important 
router.patch("/coverphotoUpdate",verifyJWT,uploadImage.single("coverphoto"),CoverimageUpdate);//only "single" file update and can be updated only if logged in...same as above
router.get("/c/:username",verifyJWT,getUserSubscriptionDetails);//getting from req.params-->url form...sysntax for this type req.params
router.get("/history",verifyJWT,getUserWatchHistory);//same as "verifyJWT" is there, it means if you looged in only can get the history

router.post('/videoUpload', verifyJWT,
    uploadVideo.single('video'),
    videoControlToUpload
)
router.get('/getVideo',verifyJWT,getVideos);

//just for checking
console.log('User routes loaded');


export default router;