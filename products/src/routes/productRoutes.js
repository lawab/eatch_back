const express = require("express");
const {
  createProduct,
  deleteProduct,
  fetchProduct,
  updateProduct,
  fetchProducts,
  fetchProductsByRestaurant,
  incrementQuantityFromProducts,
  decrementQuantityFromProducts,
  fetchProductsByRestaurantAndCategory,
} = require("../controllers/productController");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");
var productRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create product
productRouter.post(
  "/create",
  authmiddleware,
  upload.single("file"),
  createProduct
);

//delete product
productRouter.delete("/delete/:id", authmiddleware, deleteProduct);

//get product
productRouter.get("/fetch/one/:id", authmiddleware, fetchProduct);

//get products
productRouter.get(
  ["/fetch/all", "/fetch/all/:ids"],
  authmiddleware,
  fetchProducts
);

//get products by restaurant
productRouter.get(
  "/fetch/restaurant/:id",
  authmiddleware,
  fetchProductsByRestaurant
);
//get products by restaurant and category
productRouter.get(
  "/fetch/categories/:restaurantId",
  authmiddleware,
  fetchProductsByRestaurantAndCategory
);
//update product
productRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  updateProduct
);

//increment quantity from product
productRouter.put("/increment", authmiddleware, incrementQuantityFromProducts);

//decrement quantity from product
productRouter.put("/decrement", authmiddleware, decrementQuantityFromProducts);

//Export route to be used on another place
module.exports = productRouter;
