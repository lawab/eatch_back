const express = require("express");
const controller = require('../controllers/rawControllers');

const uploadFileService = require('../services/uploadFile');
const auth = require('../Middelwares/authmiddelware');

var rawRouter = express.Router() ;
const upload = uploadFileService.uploadMiddleFile();



//************CREATE RAW********************
rawRouter.post('/create', upload.single('file'), controller.createRaw);
//**************************************** *//  

//************UPDATE RAW********************
rawRouter.patch('/update/:rawId',  upload.single('file'), controller.updateRaw);
//**************************************** *// 

// //************VALIDATE RAW********************
// rawRouter.patch('/validate/:rawId', auth.authmiddleware, controller.validateAndUnvalidateRaw);
// //**************************************** *// 

//************DELETE RAW********************
rawRouter.patch('/delete/:rawId', controller.deleteRaw);
//**************************************** *// 

//************GET A RAW********************
rawRouter.get('/fetch/one/:rawId', controller.getRaw);
//**************************************** *// 

//************GET A RAW BY LABORATORYID********************
rawRouter.get('/fetch/laboratories/:laboratoryId', controller.getRawLaboratory);
//**************************************** *// 

//************GET ALL RAWS********************
rawRouter.get("/fetch/all", controller.getRaws);
//**************************************** *//

//Export route to be used on another place
module.exports = rawRouter;
