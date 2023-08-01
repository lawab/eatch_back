const express = require("express");
const controller = require('../controllers/materialControllers');

const uploadFileService = require('../services/uploadFile');
const auth = require('../Middelwares/authmiddelware');

var materialRouter = express.Router() ;
const upload = uploadFileService.uploadMiddleFile();



//************CREATE RAW********************
materialRouter.post('/create', upload.single('file'), controller.createMaterial);
//**************************************** *//  

//************UPDATE RAW********************
materialRouter.patch('/update/:materialId', upload.single('file'), controller.updateMaterial);
//**************************************** *// 

// //************VALIDATE RAW********************
// materialRouter.patch('/validate/:materialId', auth.authmiddleware, controller.validateAndUnvalidateMaterial);
// //**************************************** *// 

//************DELETE RAW********************
materialRouter.patch('/delete/:materialId', controller.deleteMaterial);
//**************************************** *// 

//************GET A RAW********************
materialRouter.get('/fetch/one/:materialId', controller.getMaterial);
//**************************************** *// 

//************GET A RAW BY LABORATORYID********************
materialRouter.get('/fetch/laboratories/:laboratoryId', controller.getMaterialLaboratory);
//**************************************** *// 

//************GET ALL RAWS********************
materialRouter.get("/fetch/all", controller.getMaterials);
//**************************************** *//

//Export route to be used on another place
module.exports = materialRouter;
