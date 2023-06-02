const express = require("express");
const controller = require("../controllers/restaurantControllers");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../Middelwares/authmiddelware");
var restaurantRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

const {
  createRestaurant,
  deleteRestaurant,
  fetchRestaurants,
  updateRestaurant,
  fetchOneRestaurant,
  // fetchClients,
} = require("../controllers/restaurantControllers");

//Create restaurant
restaurantRouter.post(
  "/create",
  authmiddleware,
  upload.single("file"),
  createRestaurant
);
//delete restaurant
restaurantRouter.put("/delete/:id", authmiddleware, deleteRestaurant);

//update restaurant
restaurantRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  updateRestaurant
);

//get one restaurant
restaurantRouter.get("/fetch/one/:id", fetchOneRestaurant);

//get all restaurant
restaurantRouter.get("/fetch/all", authmiddleware, fetchRestaurants);

//get clients
//restaurantRouter.get("/fetch/restaurants/:id", authmiddleware, fetchClients);

//Export route to be used on another place
module.exports = restaurantRouter;
