const express = require("express");
const {
  createInvoice,
  deleteInvoice,
  fetchInvoices,
  updateInvoice,
  fetchInvoice,
  fetchInvoicesByRestaurant,
} = require("../controllers/invoiceController");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");
var invoiceRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create invoice
invoiceRouter.post(
  "/create/:id",
  authmiddleware,
  upload.single("file"),
  createInvoice
);

//get invoice
invoiceRouter.get("/fetch/one/:id", authmiddleware, fetchInvoice);

//get invoices
invoiceRouter.get("/fetch/all", authmiddleware, fetchInvoices);

//get invoices by restaurant
invoiceRouter.get(
  "/fetch/restaurant/:id",
  authmiddleware,
  fetchInvoicesByRestaurant
);

//Export route to be used on another place
module.exports = invoiceRouter;
