const express = require("express");
const controller = require('../controllers/materialControllers');

const uploadFileService = require('../services/uploadFile');
const auth = require('../Middelwares/authmiddelware');

var materialRouter = express.Router() ;
const upload = uploadFileService.uploadMiddleFile();



//************CREATE RAW********************
materialRouter.post('/create', auth.authmiddleware, upload.single('file'), controller.createMaterial);
//**************************************** *//  

//************UPDATE RAW********************
materialRouter.patch('/update/:materialId', auth.authmiddleware, upload.single('file'), controller.updateMaterial);
//**************************************** *// 

// //************VALIDATE RAW********************
// materialRouter.patch('/validate/:materialId', auth.authmiddleware, controller.validateAndUnvalidateMaterial);
// //**************************************** *// 

//************DELETE RAW********************
materialRouter.patch('/delete/:materialId', auth.authmiddleware, controller.deleteMaterial);
//**************************************** *// 

//************GET A RAW********************
materialRouter.get('/fetch/one/:materialId', auth.authmiddleware, controller.getMaterial);
//**************************************** *// 

//************GET A RAW BY LABORATORYID********************
materialRouter.get('/fetch/laboratories/:laboratoryId', auth.authmiddleware, controller.getMaterialLaboratory);
//**************************************** *// 

//************GET ALL RAWS********************
materialRouter.get("/fetch/all", auth.authmiddleware, controller.getMaterials);
//**************************************** *//

//Export route to be used on another place
module.exports = materialRouter;
