const express = require("express");
const {
  createRecette,
  deleteRecette,
  fetchRecette,
  updateRecette,
  fetchRecettes,
  fetchrecettesByRestaurant,
} = require("../controllers/recetteControllers");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middelwares/authmiddelware");
var recetteRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create recette
recetteRouter.post(
  "/create",
  authmiddleware,
  upload.single("file"),
  createRecette
);

//delete recette
recetteRouter.delete("/delete/:id", authmiddleware, deleteRecette);

//get recette
recetteRouter.get("/fetch/one/:id", authmiddleware, fetchRecette);

//get recettes
recetteRouter.get(
  ["/fetch/all", "/fetch/all/:ids"],
  authmiddleware,
  fetchRecettes
);

//get recettes by restaurant
recetteRouter.get(
  "/fetch/restaurant/:id",
  authmiddleware,
  fetchrecettesByRestaurant
);

//update recette
recetteRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  updateRecette
);

//Export route to be used on another place
module.exports = recetteRouter;
