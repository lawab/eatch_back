const productServices = require("../services/productServices");
const roles = require("../models/roles");
const updateForeignFields = require("../methods/updateForeignFields");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");
const setProductValues = require("../methods/setProductValues");
const {
  addProductFromJsonFile,
} = require("../../../globalservices/generateJsonFile");
const { shellService } = require("../../../globalservices/shelService");

// create one product in database
const createProduct = async (req, res) => {
  let newproduct = null;
  try {
    let body = JSON.parse(req.headers?.body);

    // let body = req.body;

    console.log({ body });

    let bodyUpdated = await setProductValues(body, req, req.token);

    // console.log({ body });

    newproduct = await productServices.createProduct(bodyUpdated);

    console.log({ newproduct });

    if (newproduct) {
      // add new product create in historical
      let response = await addElementToHistorical(
        async () => {
          let response = await productServices.addProductToHistorical(
            newproduct._creator._id,
            {
              products: {
                _id: newproduct._id,
                action: "CREATED",
              },
            },
            req.token
          );

          let { content } = await addProductFromJsonFile(
            bodyUpdated.restaurant._id,
            req.token
          );

          await shellService(bodyUpdated.restaurant._id, req.token);
          console.log({ content: JSON.parse(content) });

          return response;
        },
        async () => {
          let elementDeleted = await productServices.deleteTrustlyProduct({
            _id: newproduct?._id,
          });
          console.log({ elementDeleted });
          return elementDeleted;
        }
      );

      if (response?.status === 200) {
        console.log({ response: response.data?.message });
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
    console.log({ error });
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
  let productCopy = null;
  let productUpdated = null;

  try {
    let body = JSON.parse(req.headers?.body);

    // let body = req.body;

    // find product which must be update
    let product = await productServices.findProduct({
      _id: req.params?.id,
    });

    if (!product) {
      console.log("eRRREUR 1")
      return res.status(401).json({
        message: "unable to update product because it not exists!!!",
      });
    }

    // cppy documment before update it
    let productCopy = Object.assign({}, product._doc);

    let bodyUpdated = await updateForeignFields(body, req, req.token);

    // update all valid fields before save it in database
    for (let key in body) {
      product[key] = bodyUpdated[key];
    }

    // update product in database
    productUpdated = await product.save();

    console.log({ productUpdated }, "~");

    if (productUpdated) {
      // add new product create in historical
      // let response = await addElementToHistorical(
      //   async () => {
          // let response = await productServices.addProductToHistorical(
          //   productUpdated._creator._id,
          //   {
          //     products: {
          //       _id: productUpdated._id,
          //       action: "UPDATED",
          //     },
          //   },
          //   req.token
          // );
          let response = 200
          let { content } = await addProductFromJsonFile(
            bodyUpdated.restaurant._id,
            req.token
          );
            console.log("{ content: JSON.parse(content) }");
          console.log({ content: JSON.parse(content) });

          await shellService(bodyUpdated.restaurant._id, req.token);

          //return response;
        // },
        // async () => {
        //   for (const field in productCopy) {
        //     if (Object.hasOwnProperty.call(productCopy, field)) {
        //       productUpdated[field] = productCopy[field];
        //     }
        //   }

        //   // restore Object in database,not update timestamps because it is restoration from olds values fields in database
        //   let productRestored = await productUpdated.save({
        //     timestamps: false,
        //   });
        //   console.log({ productRestored });
        //   return productRestored;
        // }
      // );

      // return closeRequest(
      //   response,
      //   res,
      //   "Product has been updated successfully!!!",
      //   "Product has not been Updated successfully,please try again later,thanks!!!"
      // );
      res.status(200).json({"message" : "Product updated successfully!!!"})
    } else {
      console.log("eRRREUR 2");
      res.status(401).json({
        message: "product has been not updated successfully!!",
      });
    }
  } catch (error) {
    if (productCopy && productUpdated) {
      for (const field in productCopy) {
        if (Object.hasOwnProperty.call(productCopy, field)) {
          productUpdated[field] = productCopy[field];
        }
      }

      // restore Object in database,not update timestamps because it is restoration from olds values fields in database
      // let productRestored = await productUpdated.save({
      //   validateModifiedOnly: true,
      //   timestamps: false,
      // });
      //console.log({ productRestored });
    }

    console.log(error);
    res.status(500).json({
      message: "Erros occured during the update product!!!",
    });
  }
};

// delete one product in database
const deleteProduct = async (req, res) => {
  let productCopy = null;
  let productDeleted = null;

  try {
    // let body = req.body;
    const body = JSON.parse(req.headers.body);
    console.log({ body, productId: req.params.id });
    // check if creator has authorization
    let creator = await productServices.getUserAuthor(
      body?._creator,
      req.token
    );

    // if product has authorization to update new product
    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
      return res.status(401).json({
        message: "you cannot delete the product please see you admin,thanks!!!",
      });
    }

    // find product that author want to update
    let product = await productServices.findOneProduct({
      _id: req.params?.id,
      deletedAt: null,
    });

    if (!product) {
      return res.status(401).json({
        message:
          "unable to delete product because he not exists or already deleted in database!!!",
      });
    }

    // fetch restaurant since microservice restaurant
    let restaurant = await productServices.getRestaurant(
      body?.restaurant,
      req.token
    );

    if (!restaurant?._id) {
      throw new Error("restaurant not found!!");
    }
    /* copy values and fields from product found in database before updated it. 
       it will use to restore product updated if connection with historical failed
      */
    productCopy = Object.assign({}, product._doc);

    console.log({ productCopy });

    //update deleteAt and cretor fields from product

    product.deletedAt = Date.now(); // set date of deletion
    product._creator = creator?._id; // the current product who do this action

    productDeleted = await product.save();

    console.log({ productDeleted });

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

          let { content } = await addProductFromJsonFile(
            restaurant._id,
            req.token
          );
          console.log({
            content: JSON.parse(content),
          });

          await shellService(restaurant._id, req.token);

          return response;
        },
        async () => {
          // restore only fields would had changed in database
          productDeleted["deletedAt"] = productCopy["deletedAt"];
          productDeleted["updatedAt"] = productCopy["updatedAt"];
          productDeleted["createdAt"] = productCopy["createdAt"];

          let productRestored = await productDeleted.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          console.log({ productRestored });
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
    if (productCopy && productDeleted) {
      // restore only fields would had changed in database
      productDeleted["deletedAt"] = productCopy["deletedAt"];
      productDeleted["updatedAt"] = productCopy["updatedAt"];
      productDeleted["createdAt"] = productCopy["createdAt"];

      let productRestored = await productDeleted.save({
        timestamps: false,
      }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
      console.log({ productRestored });
      return productRestored;
    }

    console.log(error);
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
    let products = [];
    let ids = req.params?.ids ? JSON.parse(req.params?.ids) : [];
    console.log({ ids });
    if (ids.length) {
      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        let product = await productServices.findOneProduct({
          _id: id,
        });
        products.push(product);
      }
      console.log({ products }, "~");
      res.status(200).json(products);
    } else {
      let products = await productServices.findProducts();
      res.status(200).json(products);
    }
  } catch (error) {
    console.log(error.message, "x");
    throw new Error(error);
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

// fetch products by restaurant in database
const fetchMaterialsFromProdcuts = async (req, res) => {
  try {
    let engredients = [];
    let ids = req.params?.ids ? JSON.parse(req.params?.ids) : [];

    if (ids.length) {
      // get array of array engredients
      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        let product = await productServices.findOneProduct({
          _id: id,
        });
        engredients.push(product.recette.engredients);
      }

      // get all array of array materials
      let materials = engredients.map((e) => {
        let material = [];
        for (let index = 0; index < e.length; index++) {
          const element = e[index];
          material.push(element.material);
        }
        return material;
      });

      let values = [];
      // merge all values of array material in one array
      for (let index = 0; index < materials.length; index++) {
        const element = materials[index];
        values = [...values, ...element];
      }

      let remoteMaterials = await productServices.getMaterials(
        values,
        req.token
      );

      // merge all values of array material in one array
      // for (let index = 0; index < remoteMaterials.length; index++) {
      //   const element = remoteMaterials[index];
      //   if (element.quantity <= 0) {
      //     throw new Error(
      //       "Material had been finish please update material and try again"
      //     );
      //   }
      // }

      // console.log({ materials: values }, "~");
      return res.status(200).json(remoteMaterials);
    } else {
      return res.status(401).json({ message: "invalid data send!!!" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch products by restaurant in database
const fetchProductsByRestaurantAndCategory = async (req, res) => {
  try {
    let categories =
      await productServices.getProductsByCategoriesForOneRestaurant(
        req.params?.restaurantId,
        req.token
      );

    res.status(200).json(categories);
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

    console.log({ productsUpdated, productsIndexes });

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

    console.log({ productsValided });

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

    console.log({ productsUpdated, productsIndexes });

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
  fetchProductsByRestaurantAndCategory,
  fetchMaterialsFromProdcuts,
};
