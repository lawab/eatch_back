const express = require("express");
const controller = require('../controllers/categoryControllers');

const uploadFileService = require('../services/uploadFile');
const auth = require('../middlewares/authmiddleware');

var categoryRouter = express.Router() ;
const upload = uploadFileService.uploadMiddleFile();



//************CREATE CATEGORY********************
categoryRouter.post('/create', auth.authmiddleware, upload.single('image'), controller.createCategory);
//**************************************** *//  

//************UPDATE CATEGORY********************
categoryRouter.patch('/update/:categoryId', auth.authmiddleware, upload.single('image'), controller.updateCategory);
//**************************************** *// 

//************GET A CATEGORY********************
categoryRouter.get('/fetch/one/:categoryId', auth.authmiddleware, controller.getCategory);
//**************************************** *// 

//************GET ALL CATEGORIES********************
categoryRouter.get("/fetch/all", auth.authmiddleware, controller.getCategories);
//**************************************** *//

//Export route to be used on another place
module.exports = categoryRouter;
