const express = require("express");
const {
  createHistorical,
  fetchHistorical,
  fetchHistoricalsByField,
  fetchHistoricalByFieldWithAction,
} = require("../controllers/historicalController");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");
var historicalRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create historical
historicalRouter.post(
  "/create/:_creator",
  authmiddleware,
  upload.single("file"),
  createHistorical
);

//get historical
historicalRouter.get("/fetch/one/:id", authmiddleware, fetchHistorical);

//get historical by field
historicalRouter.get("/fetch/:field", authmiddleware, fetchHistoricalsByField);

//get historical by field with action
historicalRouter.get(
  "/fetch/:field/:action",
  authmiddleware,
  fetchHistoricalByFieldWithAction
);

//Export route to be used on another place
module.exports = historicalRouter;
