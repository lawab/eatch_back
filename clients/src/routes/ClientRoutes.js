const express = require("express");
const {
  createClient,
  deleteClient,
  fetchClient,
  fetchClients,
  updateClient,
  fetchClientByRestaurant,
  disconnectClient,
} = require("../controllers/ClientControllers");
const uploadFileService = require("../services/uploadFile");
const auth = require("../controllers/authentification");
const { authmiddleware } = require("../middlewares/authmiddleware");
var ClientRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create Client
ClientRouter.post("/create", upload.single("file"), createClient);
//delete Client
ClientRouter.put("/delete/:id", authmiddleware, deleteClient);

//update Client
ClientRouter.put("/update/:id", upload.single("file"), updateClient);
// LOGIN ROUTE
ClientRouter.post("/login", auth.login);

//************DISCONNECT ONE client********************
ClientRouter.put("/disconnect/:id", authmiddleware, disconnectClient);

//get Client
ClientRouter.get("/fetch/one/:id", authmiddleware, fetchClient);

//get Clients
ClientRouter.get("/fetch/all", authmiddleware, fetchClients);

//get Clients by restaurant
ClientRouter.get(
  "/fetch/restaurant/:id",
  authmiddleware,
  fetchClientByRestaurant
);

module.exports = ClientRouter;
