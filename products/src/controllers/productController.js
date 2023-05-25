const { fieldsRequired } = require("../models/product/product");
const { fieldsValidator } = require("../models/product/validators");

const productServices = require("../services/productServices");
const roles = require("../models/roles");
const updateForeignFields = require("./updateForeignFields");
const print = require("../log/print");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");
const { addProductFromJsonFile } = require("../services/generateJsonFile");
const setProductValues = require("../methods/setProductValues");

// create one product in database
const createProduct = async (req, res) => {
  let newproduct = null;
  try {
    let body = req.body;

    let bodyUpdate = await setProductValues(body, req, req.token);

    newproduct = await productServices.createProduct(bodyUpdate);

    print({ newproduct });

    if (newproduct) {
      // add new product create in historical
      let response = await addElementToHistorical(
        async () => {
          let content = await addProductFromJsonFile(
            productServices,
            newproduct
          );

          console.log({ content: JSON.parse(content) });

          return await productServices.addProductToHistorical(
            newproduct._creator._id,
            {
              products: {
                _id: newproduct._id,
                action: "CREATED",
              },
            },
            req.token
          );
        },
        async () => {
          let elementDeleted = await productServices.deleteTrustlyProduct({
            _id: newproduct?._id,
          });
          print({ elementDeleted });
          return elementDeleted;
        }
      );

      if (response?.status === 200) {
        print({ response: response.data?.message });
        return res
          .status(200)
          .json({ message: "Product has been created successfully!!!" });
      } else {
        return res.status(401).json({
          message:
            "Product has  been not creadted successfully,please try again later,thanks!!!",
        });
      }
    } else {
      res
        .status(401)
        .json({ message: "product has been not created successfully!!!" });
    }
  } catch (error) {
    print({ error });
    if (newproduct) {
      await productServices.deleteTrustlyProduct({
        _id: newproduct._id,
      });
    }

    return res
      .status(500)
      .json({ message: "Error occured during a creation of product!!!" });
  }
};

// update product in database
const updateProduct = async (req, res) => {
  try {
    let body = req.body;
    // get the author to update product
    let creator = await productServices.getUserAuthor(
      body?._creator,
      req.token
    );
    const { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

    if (!creator?._id || !validate) {
      return res.status(401).json({
        message: "Invalid data send!!!",
      });
    }

    // if product has authorization to update new product
    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message: "you cannot create the product please see you admin,thanks!!!",
      });
    }

    // find product which must be update
    let product = await productServices.findProduct({
      _id: req.params?.id,
    });

    if (!product) {
      return res.status(401).json({
        message: "unable to update product because it not exists!!!",
      });
    }

    let productCopy = Object.assign({}, product._doc); // cppy documment before update it

    body["_creator"] = creator; // set user that make update in database

    // update foreign fields and update body request before save in database
    body = await updateForeignFields(productServices, body, req.token);
    print(
      {
        restaurant: body.restaurant,
        product: product._id,
        materials: body.materials,
      },
      "*"
    );

    // update all valid fields before save it in database
    for (let key in body) {
      product[key] = body[key];
    }

    // update avatar if exists
    product["image"] = req.file
      ? "/datas/" + req.file?.filename
      : product["image"];

    // update product in database
    let productUpdated = await product.save({ validateModifiedOnly: true });

    print({ productUpdated }, "U");

    if (productUpdated?._id) {
      // add new product create in historical
      let response = await addElementToHistorical(
        async () => {
          let content = await addProductFromJsonFile(
            productServices,
            productUpdated
          );

          console.log({ content: JSON.parse(content) });
          let response = await productServices.addProductToHistorical(
            creator?._id,
            {
              products: {
                _id: productUpdated?._id,
                action: "UPDATED",
              },
            },
            req.token
          );

          return response;
        },
        async () => {
          for (const field in productCopy) {
            if (Object.hasOwnProperty.call(productCopy, field)) {
              productUpdated[field] = productCopy[field];
            }
          }
          let productRestored = await productUpdated.save({
            validateModifiedOnly: true,
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ productRestored });
          return productRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "Product has been updated successfully!!!",
        "Product has not been Updated successfully,please try again later,thanks!!!"
      );
    } else {
      res.status(401).json({
        message: "product has been not updated successfully!!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erros occured during the update product!!!",
    });
  }
};

// delete one product in database
const deleteProduct = async (req, res) => {
  try {
    let body = req.body;
    // check if creator has authorization
    let creator = await productServices.getUserAuthor(
      body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    // if product has authorization to update new product
    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message: "you cannot create the product please see you admin,thanks!!!",
      });
    }

    // find product that author want to update
    let product = await productServices.findOneProduct({
      _id: req.params?.id,
      deletedAt: null,
    });

    if (!product?._id) {
      return res.status(401).json({
        message:
          "unable to delete product because he not exists or already deleted in database!!!",
      });
    }

    /* copy values and fields from product found in database before updated it. 
       it will use to restore product updated if connection with historical failed
      */
    let productCopy = Object.assign({}, product._doc);

    print({ productCopy });

    //update deleteAt and cretor fields from product

    product.deletedAt = Date.now(); // set date of deletion
    product._creator = creator?._id; // the current product who do this action

    let productDeleted = await product.save();

    print({ productDeleted });

    // product exits and had deleted successfully
    if (productDeleted?.deletedAt) {
      // add new product create in historical
      let response = await addElementToHistorical(
        async () => {
          let productDoc = productDeleted?._doc;
          let content = await addProductFromJsonFile(
            productServices,
            productDeleted
          );

          console.log({
            productDeleted: productDoc,
            content: JSON.parse(content),
          });

          let response = await productServices.addProductToHistorical(
            creator?._id,
            {
              products: {
                _id: productDeleted?._id,
                action: "DELETED",
              },
            },
            req.token
          );

          return response;
        },
        async () => {
          for (const field in productCopy) {
            if (Object.hasOwnProperty.call(productCopy, field)) {
              productDeleted[field] = productCopy[field];
            }
          }
          let productRestored = await productDeleted.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ productRestored });
          return productRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "product has been delete successfully!!!",
        "product has not been delete successfully,please try again later,thanks!!!"
      );
    } else {
      return res.status(500).json({ message: "deletion of product failed" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error occured during the deletion of product!!!" });
  }
};
// get one product in database
const fetchProduct = async (req, res) => {
  try {
    let product = await productServices.findProduct({
      _id: req.params?.id,
    });
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};
// get products in database
const fetchProducts = async (req, res) => {
  try {
    let ids = req.params?.ids ? JSON.parse(req.params?.ids) : [];
    if (ids.length) {
      let products = await productServices.findProducts({
        _id: { $in: ids },
      });
      print({ products }, "~");
      res.status(200).json(products);
    } else {
      let products = await productServices.findProducts();
      res.status(200).json(products);
    }
  } catch (error) {
    print(error.message, "x");
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch products by restaurant in database
const fetchProductsByRestaurant = async (req, res) => {
  try {
    let products = await productServices.findProducts({
      "restaurant._id": req.params?.id,
    });
    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

const incrementQuantityFromProducts = async (req, res) => {
  try {
    let productsIndexes = req.body.products?.map((pd) => pd._id);

    let productsUpdated = await incrementOrDecrementProductQuantity(
      productsIndexes,
      1
    );

    print({ productsUpdated, productsIndexes });

    if (productsUpdated.length === products.length) {
      res.status(200).json(productsUpdated);
    } else {
      res.status(401).json({ message: "unable to updated products" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

const decrementQuantityFromProducts = async (req, res) => {
  try {
    let productsIndexes = req.body.products?.map((pd) => pd._id);

    let productsValided = await productServices.findProducts({
      _id: { $in: productsIndexes },
    });

    print({ productsValided });

    // validaton of quantities from all product before save it in database
    for (let index = 0; index < productsValided.length; index++) {
      const element = productsValided[index];
      if (element.quantity - 1 < 0) {
        throw new Error(
          "unable to make invoice because some quantity(ies) of products are so less of 0"
        );
      }
    }

    let productsUpdated = await incrementOrDecrementProductQuantity(
      productsIndexes,
      -1
    );

    print({ productsUpdated, productsIndexes });

    if (productsUpdated.length === productsIndexes.length) {
      res.status(200).json(productsUpdated);
    } else {
      res.status(401).json({ message: "unable to updated products" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

async function incrementOrDecrementProductQuantity(productsIndexes, value) {
  let productsValues = [];
  for (let index = 0; index < productsIndexes.length; index++) {
    let productDb = await productServices.findOneProduct({
      _id: productsIndexes[index],
    });

    productDb.quantity = productDb.quantity + value;

    let pdUpdated = await productDb.save();

    productsValues.push(pdUpdated);
  }

  return productsValues;
}

module.exports = {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
  fetchProduct,
  fetchProductsByRestaurant,
  incrementQuantityFromProducts,
  decrementQuantityFromProducts,
};
