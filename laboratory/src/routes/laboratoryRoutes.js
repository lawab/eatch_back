const express = require("express");
//const controller = require("../controllers/laboratoryControllers");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../Middelwares/authmiddelware");
var laboratoryRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

const {
  createLaboratory,
  deleteLaboratory,
  fetchLaboratories,
  updateLaboratory,
  fetchOneLaboratory,
  addProvider,
  updateProvidingLaboratory,
  updateManufacturingLaboratory,
  addRequestingToLaboratory,
  validateRequestingToLaboratory
  // fetchClients,
} = require("../controllers/laboratoryControllers");

//Create laboratory
laboratoryRouter.post(
  "/create",
  authmiddleware,
  upload.single("file"),
  createLaboratory
);
//delete laboratory
laboratoryRouter.put("/delete/:id", authmiddleware, deleteLaboratory);

//update Laboratory
laboratoryRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  updateLaboratory
);

//get one Laboratory
laboratoryRouter.get("/fetch/one/:id", authmiddleware, fetchOneLaboratory);

//get all Laboratory
laboratoryRouter.get("/fetch/all", authmiddleware, fetchLaboratories);

//add provider
laboratoryRouter.put(
  "/addProvider/:laboId",
  authmiddleware,
  upload.single("file"),
  addProvider
);

//update providing
laboratoryRouter.patch("/updateProviding", updateProvidingLaboratory);

//update manufacturing
laboratoryRouter.patch("/updateManufacturing", updateManufacturingLaboratory);

//Add requesting from Restaurant
laboratoryRouter.patch(
  "/addRequesting/:laboratoryId",
  addRequestingToLaboratory
);

//Validate requesting from Restaurant
laboratoryRouter.patch(
  "/validateRequesting",
  validateRequestingToLaboratory
);

//get clients
//LaboratoryRouter.get("/fetch/Laboratorys/:id", authmiddleware, fetchClients);

//Export route to be used on another place
module.exports = laboratoryRouter;
