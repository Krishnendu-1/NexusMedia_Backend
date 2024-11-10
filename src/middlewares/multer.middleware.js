import multer from "multer"

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./photo/temp');//cb-->call back
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }

})

export const upload=multer({
    // storage:storage//*in ES6 if "storage:storage" same names, then just write "storage"
    storage,

})
 