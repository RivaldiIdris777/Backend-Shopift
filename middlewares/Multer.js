const multer = require("multer");

const storage = multer.diskStorage({
    filename : (req, file, cb) =>  {
        cb(null, file.fieldname + new Date().getTime()+ "-" + file.originalname)
    }
})

const filter = (req, file, cb) => {
    if(file.mimetype == "image/jpg" || file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
        cb(null, true)
    }else {
        cb(null, false)
    }
}

const size_upload  = multer({storage: storage, limits: {
    fileSize: 1024 * 1024 * 10
}});

const upload = multer({
    storage: storage,
    fileFilter : filter,        
    limits : size_upload
})

module.exports = upload;