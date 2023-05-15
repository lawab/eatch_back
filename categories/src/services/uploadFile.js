const multer = require('multer');


//Upload file
function uploadMiddleFile() {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./public/datas");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now()+'_'+file.originalname);
        },
    });
    const upload = multer({storage : storage});
    return upload;
}






module.exports = {
    
    uploadMiddleFile,
   
}
