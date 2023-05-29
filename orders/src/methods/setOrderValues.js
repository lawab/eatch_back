const { default: mongoose } = require("mongoose");
const print = require("../log/print");

/**
 *
 * @param {Object} orderServices [product microservice to manage product in database]
 * @param {Object} body [Body Object from express]
 * @param {Object} req [req Object from express]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (orderServices, body, req) => {
  try {
    let errorMessage = (field) => `invalid ${field}`;
    let token = req.token;

    // find restaurant in database
    let restaurant = await orderServices.getRestaurant(body?.restaurant, token);

    if (!restaurant?._id) {
      throw new Error(errorMessage("restaurant"));
    }

    console.log({ restaurant });

    // update restaurant with value found in database
    body["restaurant"] = restaurant;

    // find client in database
    let client = await orderServices.getClient(body?.client, token);
    print({ client });

    // if client not exists in database, generate random _id for client
    if (!client?._id) {
      body["client"] = {
        _id: mongoose.Types.ObjectId(),
      };
    }

    //if client found in database, set client found in database
    if (client?._id) {
      body["client"] = client;
    }

    // set ids list from products
    let productsIds = body?.products;

    if (!productsIds?.length) {
      throw new Error(errorMessage("products"));
    }

    // get list of products
    let products = await orderServices.getProducts(productsIds, token);

    let invalidProducts = products.filter((el) => !el?._id);

    // verify that products has been set successfully
    if (
      !products?.length ||
      products?.length !== body?.products?.length ||
      invalidProducts?.length
    ) {
      throw new Error(errorMessage("products"));
    }

    print({ products });

    body["products"] = products;

    // body["products"] = products.map((product) => {
    //   let productFound = body.products.find((p) => p._id === product._id);
    //   return { ...product, quantity: productFound.quantity };
    // });

    // add image from order
    body["image"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";

    return body;
  } catch (error) {
    print({ error }, "x");
    throw new Error(error.message);
  }
};
