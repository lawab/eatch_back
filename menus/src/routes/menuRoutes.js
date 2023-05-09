const express = require("express");
const {
  createMenu,
  deleteMenu,
  fetchMenus,
  updateMenu,
  fetchMenu,
  fetchMenusByRestaurant,
} = require("../controllers/menuController");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");
var menuRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create menu
menuRouter.post("/create", authmiddleware, upload.single("file"), createMenu);

//delete menu
menuRouter.delete("/delete/:id", authmiddleware, deleteMenu);

//get menu
menuRouter.get("/fetch/one/:id", authmiddleware, fetchMenu);

//get menus
menuRouter.get(["/fetch/all", "/fetch/all/:ids"], authmiddleware, fetchMenus);

//get menus by restaurant
menuRouter.get("/fetch/restaurant/:id", authmiddleware, fetchMenusByRestaurant);

//update menu
menuRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  updateMenu
);

//Export route to be used on another place
module.exports = menuRouter;
