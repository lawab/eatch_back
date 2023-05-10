const express = require("express");
const {
  createPromotion,
  deletePromotion,
  fetchPromotion,
  updatePromotion,
  fetchPromotions,
  fetchPromotionsByRestaurant,
} = require("../controllers/promotionController");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");
var promotionRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create promotion
promotionRouter.post(
  "/create",
  authmiddleware,
  upload.single("file"),
  createPromotion
);

//delete promotion
promotionRouter.delete("/delete/:id", authmiddleware, deletePromotion);

//get promotion
promotionRouter.get("/fetch/one/:id", authmiddleware, fetchPromotion);

//get promotions
promotionRouter.get(
  ["/fetch/all", "/fetch/all/:ids"],
  authmiddleware,
  fetchPromotions
);

//get promotions by restaurant
promotionRouter.get(
  "/fetch/restaurant/:id",
  authmiddleware,
  fetchPromotionsByRestaurant
);

//update promotion
promotionRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  updatePromotion
);

//Export route to be used on another place
module.exports = promotionRouter;
