const { default: mongoose } = require("mongoose");
const print = require("../log/print");

/**
 *
 * @param {Object} res [Object Response from express to send response to client if necessary]
 * @param {Object} orderServices [product microservice to manage product in database]
 * @param {Object} body [Body Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (orderServices, body, token) => {
  try {
    let errorMessage = (field) => `invalid ${field}`;

    // verify restaurant in database
    let restaurant = await orderServices.getRestaurant(body?.restaurant, token);

    if (!restaurant?._id) {
      throw new Error(errorMessage("restaurant"));
    }
    body["restaurant"] = restaurant; // update restaurant with value found in database

    // verify the existing of category in database if it's in body request before update it in database
    let client = await orderServices.getClient(body?.client, token);
    print({ client });

    // if client not exists in database
    if (!client?._id) {
      body["client"] = {
        _id: mongoose.Types.ObjectId(), // generate random _id for client
      };
    }
    //if client found in database
    if (client?._id) {
      body["client"] = client; // update client field with client found in database
    }

    // set ids list from products
    let productsIds = body?.products;

    if (!productsIds?.length) {
      throw new Error(errorMessage("products"));
    }

    // get list of products
    let products = await orderServices.getProducts(productsIds, token);

    // if products not exists in database
    if (!products?.length || products?.length !== body?.products?.length) {
      throw new Error(errorMessage("products"));
    }

    body["products"] = products;

    return body;
  } catch (error) {
    throw new Error(error.message);
  }
};
