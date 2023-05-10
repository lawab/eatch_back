const express = require("express");
const {
  createLogistic,
  deleteLogistic,
  fetchLogistic,
  updateLogistic,
  fetchLogistics,
  fetchLogisticsByRestaurant,
} = require("../controllers/logisticController");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");
var logisticRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create logistic
logisticRouter.post(
  "/create/:id",
  authmiddleware,
  upload.single("file"),
  createLogistic
);

//delete logistic
logisticRouter.delete("/delete/:id", authmiddleware, deleteLogistic);

//get logistic
logisticRouter.get("/fetch/one/:id", authmiddleware, fetchLogistic);

//get logistics
logisticRouter.get(
  ["/fetch/all", "/fetch/all/:ids"],
  authmiddleware,
  fetchLogistics
);

//get logistics by restaurant
logisticRouter.get(
  "/fetch/restaurant/:id",
  authmiddleware,
  fetchLogisticsByRestaurant
);

//update logistic
logisticRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  updateLogistic
);

//Export route to be used on another place
module.exports = logisticRouter;
