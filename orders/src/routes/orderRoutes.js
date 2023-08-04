const express = require("express");
const {
  createOrder,
  createOrderversion2,
  createOrderversionMobile,
  deleteOrder,
  fetchOrders,
  updateOrder,
  fetchOrder,
  fetchOrdersByRestaurant,
  updateOrderRemote,
  deleteOrderRemote,
} = require("../controllers/orderController");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");
var orderRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create product
//orderRouter.post("/create", createOrder);

//Create Order version 2
orderRouter.post("/create", createOrderversion2);

//Create Order version mobile
orderRouter.post("/createMobile", createOrderversionMobile);

//delete product
orderRouter.delete("/delete/:id", authmiddleware, deleteOrder);
orderRouter.delete("/delete/remomte/:id", authmiddleware, deleteOrderRemote);

//get product
orderRouter.get("/fetch/one/:id", authmiddleware, fetchOrder);

//get products
orderRouter.get("/fetch/all", fetchOrders);

//get products by restaurant
orderRouter.get(
  "/fetch/restaurant/:id",
  authmiddleware,
  fetchOrdersByRestaurant
);

//update product
orderRouter.put(
  "/update/:id",
  updateOrder
);

orderRouter.put("/update/remote/:id", authmiddleware, updateOrderRemote);

//Export route to be used on another place
module.exports = orderRouter;
