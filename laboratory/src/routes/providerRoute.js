const express = require("express");
const controller = require('../controllers/providerControllers');

const uploadFileService = require('../services/uploadFile');
const auth = require('../Middelwares/authmiddelware');

var providerRouter = express.Router() ;
const upload = uploadFileService.uploadMiddleFile();



//************CREATE PROVIDER********************
providerRouter.post('/create', auth.authmiddleware, upload.single('file'), controller.createProvider);
//**************************************** *//  

//************UPDATE PROVIDER********************
providerRouter.patch('/update/:providerId', auth.authmiddleware, upload.single('file'), controller.updateProvider);
//**************************************** *// 

// //************VALIDATE PROVIDER********************
// providerRouter.patch('/validate/:providerId', auth.authmiddleware, controller.validateAndUnvalidateProvider);
// //**************************************** *// 

//************DELETE PROVIDER********************
providerRouter.patch('/delete/:providerId', auth.authmiddleware, controller.deleteProvider);
//**************************************** *// 

//************GET A PROVIDER********************
providerRouter.get('/fetch/one/:providerId', controller.getProvider);
//**************************************** *// 

//************GET A PROVIDER BY LABORATORYID********************
providerRouter.get('/fetch/laboratories/:laboratoryId', controller.getProviderLaboratory);
//**************************************** *// 

//************GET ALL PROVIDERS********************
providerRouter.get("/fetch/all", controller.getProviders);
//**************************************** *//

//Export route to be used on another place
module.exports = providerRouter;
