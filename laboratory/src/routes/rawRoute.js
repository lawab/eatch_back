const express = require("express");
const controller = require('../controllers/rawControllers');

const uploadFileService = require('../services/uploadFile');
const auth = require('../Middelwares/authmiddelware');

var rawRouter = express.Router() ;
const upload = uploadFileService.uploadMiddleFile();



//************CREATE RAW********************
rawRouter.post('/create', auth.authmiddleware, upload.single('file'), controller.createRaw);
//**************************************** *//  

//************UPDATE RAW********************
rawRouter.patch('/update/:rawId', auth.authmiddleware, upload.single('file'), controller.updateRaw);
//**************************************** *// 

// //************VALIDATE RAW********************
// rawRouter.patch('/validate/:rawId', auth.authmiddleware, controller.validateAndUnvalidateRaw);
// //**************************************** *// 

//************DELETE RAW********************
rawRouter.patch('/delete/:rawId', auth.authmiddleware, controller.deleteRaw);
//**************************************** *// 

//************GET A RAW********************
rawRouter.get('/fetch/one/:rawId', auth.authmiddleware, controller.getRaw);
//**************************************** *// 

//************GET A RAW BY LABORATORYID********************
rawRouter.get('/fetch/laboratories/:laboratoryId', auth.authmiddleware, controller.getRawLaboratory);
//**************************************** *// 

//************GET ALL RAWS********************
rawRouter.get("/fetch/all", auth.authmiddleware, controller.getRaws);
//**************************************** *//

//Export route to be used on another place
module.exports = rawRouter;
