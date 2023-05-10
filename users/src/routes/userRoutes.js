const express = require("express");
const {
  createUser,
  deleteUser,
  UpdateUser,
  fetchUsers,
  fetchUser,
  fetchUsersInRestaurant,
  createUserRole,
  UpdateRole,
  deleteRole,
  fetchAllRole,
  fetchAllRoles,
  fetchOneRole,
} = require("../controllers/userControllers");
const {
  createEmployerType,
  UpdateEmployerType,
  deleteEmployerType,
  fetchEmployerType,
  fetchAllEmployerType,
} = require("../controllers/employerTypeController");
const auth = require("../controllers/auth/authentification");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");

var userRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//************LOGIN ROUTE********************
userRouter.post("/login", auth.login);

//**************************************** POST ROUTES //****************************************//

//************CREATE USER********************
userRouter.post("/create", authmiddleware, upload.single("file"), createUser);

//************CREATE ROLE********************
userRouter.post(
  "/create/role",
  authmiddleware,
  upload.single("file"),
  createUserRole
);

//************ CREATE EMPLOYERTYPE********************
userRouter.post("/create/employertype", authmiddleware, createEmployerType);

//**************************************** DELETE ROUTES //****************************************//

//************DELETE ONE USER********************
userRouter.delete("/delete/:id", authmiddleware, deleteUser);

//************DELETE ONE EMPLOYERTYPE********************
userRouter.delete(
  "/delete/employertype/:id",
  authmiddleware,
  deleteEmployerType
);

//************DELETE ONE ROLE********************
userRouter.delete("/delete/role/:id", authmiddleware, deleteRole);

//**************************************** PUT ROUTES //****************************************//

//************UPDATE ONE EMPLOYERTYPE********************
userRouter.put(
  "/update/employertype/:id",
  authmiddleware,
  upload.single("file"),
  UpdateEmployerType
);
//************UPDATE ONE ROLE********************

userRouter.put(
  "/update/role/:id",
  authmiddleware,
  upload.single("file"),
  UpdateRole
);
//************UPDATE ONE USER********************
userRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  UpdateUser
);

//**************************************** GET ALL ROUTE //****************************************//

//************GET All USERS********************
userRouter.get("/fetch/all", authmiddleware, fetchUsers);

//************GET ALL ROLES********************
userRouter.get("/fetch/all/roles", authmiddleware, fetchAllRoles);

//************GET ALL EMPLOYERTYPE********************
userRouter.get(
  "/fetch/all/employertypes",
  authmiddleware,
  fetchAllEmployerType
);

//************GET ONE USER********************
userRouter.get("/fetch/one/:id", authmiddleware, fetchUser);

//************GET ONE ROLE********************
userRouter.get("/fetch/one/role/:id", authmiddleware, fetchOneRole);

//************GET ONE EMPLOYERTYPE********************
userRouter.get(
  "/fetch/one/employertype/:id",
  authmiddleware,
  fetchEmployerType
);

//************GET ALL USERS BY RESTAURANT********************
userRouter.get("/fetch/restaurant/:id", authmiddleware, fetchUsersInRestaurant);

//**************************************** *//

//Export route to be used on another place
module.exports = userRouter;
