const express = require("express");
const {
  createOrder,
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
orderRouter.post("/create", createOrder);

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
  authmiddleware,
  upload.single("file"),
  updateOrder
);

orderRouter.put("/update/remote/:id", authmiddleware, updateOrderRemote);

//Export route to be used on another place
module.exports = orderRouter;
