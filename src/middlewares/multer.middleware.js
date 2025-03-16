import multer from "multer"

const imagestorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./photo/temp');//cb-->call back
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }

})

const videostorage=multer.diskStorage(
    {
        destination:function(req,file,cb){
            cb(null,'./video/temp');
        },
        filename:function(req,file,cb){
            cb(null,file.originalname);
        }

    }
)

export const uploadImage=multer({
    // storage:storage//*in ES6 if "storage:storage" same names, then just write "storage"
    storage:imagestorage
})
export const uploadVideo=multer({

    // storage:storage//*in ES6 if "storage:storage" same names, then just write "storage"
    storage:videostorage
})
