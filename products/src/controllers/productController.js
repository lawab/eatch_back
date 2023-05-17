const { fieldsRequired } = require("../models/product/product");
const { fieldsValidator } = require("../models/product/validators");

const productServices = require("../services/productServices");
const roles = require("../models/roles");
const setForeignFieldsRequired = require("./setForeignFieldsRequired");
const updateForeignFields = require("./updateForeignFields");
const print = require("../log/print");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");

// create one product in database
const createProduct = async (req, res) => {
  try {
    let body = req.body;
    const message = "invalid data!!!";

    // verify fields on body
    let { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

    // if body have invalid fields
    if (!validate) {
      return res.status(401).json({ message });
    }

    // get creator since microservice users
    let creator = await productServices.getUserAuthor(
      body?._creator,
      req.token
    );

    print({ creator: creator?._id });

    if (!creator?._id) {
      return res.status(401).json({ message });
    }

    // if product has authorization to create new product
    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message: "you cannot create the product please see you admin,thanks!!!",
      });
    }

    // product has authorization

    // set restaurant,category and materials fields required
    body = await setForeignFieldsRequired(
      {
        restaurant_id: body?.restaurant,
        category_id: body?.category,
        materila_ids: body?.materials,
      },
      req.token,
      body
    );

    // add image from product
    body["image"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";

    let newproduct = await productServices.createProduct(body);

    print({ newproduct });

    if (newproduct?._id) {
      // add new product create in historical
      let response = await addElementToHistorical(
        async () => {
          let addResponse = await productServices.addProductToHistorical(
            creator?._id,
            {
              products: {
                _id: newproduct?._id,
                action: "CREATED",
              },
            },
            req.token
          );

          return addResponse;
        },
        async () => {
          let elementDeleted = await productServices.deleteTrustlyProduct({
            _id: newproduct?._id,
          });
          print({ elementDeleted });
          return elementDeleted;
        }
      );

      return closeRequest(
        response,
        res,
        "Product has been created successfully!!!",
        "Product has  been not creadted successfully,please try again later,thanks!!!"
      );
    } else {
      res
        .status(401)
        .json({ message: "product has been not created successfully!!!" });
    }
  } catch (error) {
    console.log(error);
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
        "product has not been deleete successfully,please try again later,thanks!!!"
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

module.exports = {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
  fetchProduct,
  fetchProductsByRestaurant,
};
