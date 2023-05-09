const express = require("express");
const {
  createUser,
  deleteUser,
  UpdateUser,
  fetchUsers,
  fetchUser,
  fetchUsersInRestaurant,
} = require("../controllers/userControllers");
const { createEmployerType } = require("../controllers/employerTypeController");
const auth = require("../controllers/auth/authentification");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");

var userRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//************CREATE ROUTE********************
userRouter.post("/create", authmiddleware, upload.single("file"), createUser);
//**************************************** *//

//************LOGIN ROUTE********************
userRouter.post("/login", auth.login);
//**************************************** *//

//************POST ROUTE:create employerType********************
userRouter.post("/employertype/create/", authmiddleware, createEmployerType);

//************DELETE ROUTE********************
userRouter.delete("/delete/:id", authmiddleware, deleteUser);
//**************************************** *//

//************UPDATE ROUTE********************
userRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  UpdateUser
);
//**************************************** *//

//************GET ROUTE:get all users********************
userRouter.get("/fetch/all", authmiddleware, fetchUsers);
//**************************************** *//
//************GET ROUTE:get single user********************
userRouter.get("/fetch/one/:id", authmiddleware, fetchUser);
//**************************************** *//

//************GET ROUTE:get users by restaurant********************
userRouter.get("/fetch/restaurant/:id", authmiddleware, fetchUsersInRestaurant);

//**************************************** *//
//Export route to be used on another place
module.exports = userRouter;
