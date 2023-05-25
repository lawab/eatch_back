const roles = require("../models/roles");
const menuServices = require("../services/menuServices");

/**
 * @author <uchokomeny@gmail.com>
 * @param {Object} body [Body Object from express]
 * @param {Object} req [Object Request from express to send response to client if necessary]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Object>} [Body object updated]
 */
module.exports = async (body, req, token) => {
  let errorMessage = (field) => `Invalid ${field}`;

  try {
    // if user want to update a restaurant menu
    // get restaurant in database
    let restaurant = await menuServices.getRestaurant(body?.restaurant, token);

    if (!restaurant?._id) {
      throw new Error(errorMessage("restaurant"));
    }
    body["restaurant"] = restaurant; // update restaurant with value found in database

    if (body?.products?.length) {
      //   get products in databsase
      let products = await menuServices.getProducts(body?.products, token);

      if (!products?.length || products?.length !== body?.products?.length) {
        throw new Error(errorMessage("products"));
      }

      body["products"] = products; //set products values found in database
    }

    return body;
  } catch (error) {
    throw new Error(error);
  }
};
