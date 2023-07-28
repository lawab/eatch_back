const express = require("express");
const {
  updateHistorical,
  fetchHistorical,
  fetchHistoricalsByField,
  fetchHistoricalByFieldWithAction,
  getHistoricals,
} = require("../controllers/historicalController");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");
var historicalRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create historical
historicalRouter.put(
  "/update/:_creator",
  authmiddleware,
  upload.single("file"),
  updateHistorical
);

//get historical
historicalRouter.get("/fetch/one/:id", authmiddleware, fetchHistorical);

//get historical by field
historicalRouter.get("/fetch/:field", authmiddleware, fetchHistoricalsByField);

//get all historicals
historicalRouter.get("/fetch/all", authmiddleware, getHistoricals);

//get historical by field with action
historicalRouter.get(
  "/fetch/:field/:action",
  authmiddleware,
  fetchHistoricalByFieldWithAction
);

//Export route to be used on another place
module.exports = historicalRouter;
