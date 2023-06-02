const express = require("express");
const {
  createMaterial,
  deleteMaterial,
  fetchMaterials,
  updateMaterial,
  fetchMaterial,
  fetchMaterialsByRestaurant,
  decrementMaterials,
  restoreMaterials,
} = require("../controllers/materialController");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");
var materialRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create material
materialRouter.post(
  "/create",
  authmiddleware,
  upload.single("file"),
  createMaterial
);

//delete material
materialRouter.delete("/delete/:id", authmiddleware, deleteMaterial);

//get material
materialRouter.get("/fetch/one/:id", authmiddleware, fetchMaterial);

//get materials
materialRouter.get(
  ["/fetch/all", "/fetch/all/:ids"],
  authmiddleware,
  fetchMaterials
);

//get materials by restaurant
materialRouter.get(
  "/fetch/restaurant/:id",
  authmiddleware,
  fetchMaterialsByRestaurant
);

//update material
materialRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  updateMaterial
);

//decrement materials
materialRouter.put("/decrement", authmiddleware, decrementMaterials);

//restore materials
materialRouter.put("/restore", authmiddleware, restoreMaterials);

//Export route to be used on another place
module.exports = materialRouter;
