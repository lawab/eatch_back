const express = require("express");
const controller = require("../controllers/categoryControllers");

const uploadFileService = require("../services/uploadFile");
const auth = require("../middlewares/authmiddleware");

var categoryRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//************CREATE CATEGORY********************
categoryRouter.post(
  "/create",
  auth.authmiddleware,
  upload.single("file"),
  controller.createCategory
);
//**************************************** *//

//************UPDATE CATEGORY********************
categoryRouter.patch(
  "/update/:categoryId",
  auth.authmiddleware,
  upload.single("file"),
  controller.updateCategory
);
//**************************************** *//

//************UPDATE CATEGORY********************
categoryRouter.patch(
  "/delete/:categoryId",
  auth.authmiddleware,
  controller.deleteCategory
);
//**************************************** *//

//************GET A CATEGORY********************
categoryRouter.get(
  "/fetch/one/:categoryId",
  auth.authmiddleware,
  controller.getCategory
);
//**************************************** *//

//************GET ALL CATEGORIES********************
categoryRouter.get("/fetch/all", auth.authmiddleware, controller.getCategories);
//**************************************** *//

//************GET ALL CATEGORIES********************
categoryRouter.get(
  "/fetch/restaurant/:restaurantId",
  auth.authmiddleware,
  controller.getCategoriesByRestaurant
);
//**************************************** *//

//************GET ALL CATEGORIES WITHOUT TOKEN********************
categoryRouter.get(
  "/getCategories/restaurant/:restaurantId",
  controller.getCategoriesByRestaurant
);
//**************************************** *//

//Export route to be used on another place
module.exports = categoryRouter;
