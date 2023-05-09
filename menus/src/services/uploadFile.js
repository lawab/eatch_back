const multer = require('multer');


//Upload file
function uploadMiddleFile() {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./public/datas");
        },
        filename: (req, file, cb) => {
            cb(null, req.headers.nom_file+'_'+req.headers.type_affichage+"."+file.originalname.split('.').pop());
        },
    });
    const upload = multer({storage : storage});
    return upload;
}






module.exports = {
    
    uploadMiddleFile,
   
}
