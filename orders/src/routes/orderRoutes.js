const express = require("express");
const {
  createOrder,
  deleteOrder,
  fetchOrders,
  updateOrder,
  fetchOrder,
  fetchOrdersByRestaurant,
} = require("../controllers/orderController");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");
var orderRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create product
orderRouter.post("/create", authmiddleware, upload.single("file"), createOrder);

//delete product
orderRouter.delete("/delete/:id", authmiddleware, deleteOrder);

//get product
orderRouter.get("/fetch/one/:id", authmiddleware, fetchOrder);

//get products
orderRouter.get("/fetch/all", authmiddleware, fetchOrders);

//get products by restaurant
orderRouter.get(
  "/fetch/restaurant/:id",
  authmiddleware,
  fetchOrdersByRestaurant
);

//update product
orderRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  updateOrder
);

//Export route to be used on another place
module.exports = orderRouter;
