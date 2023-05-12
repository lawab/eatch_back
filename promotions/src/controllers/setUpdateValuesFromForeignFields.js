const print = require("../log/print");
const promotionServices = require("../services/promotionServices");

/**
 *
 * @param {Object} body [Object body receive since request]
 * @param {String} token [to authenticate user session]
 * @returns {Promise<Object>} body [updated Object body receive since request]
 */
module.exports = async (body, token) => {
  try {
    let errorMessage = (field) => `invalid ${field}`;

    if (body?.restaurant) {
      // get restaurant required field
      let restaurant = await promotionServices.getRestaurant(
        body?.restaurant,
        token
      );

      if (!restaurant?._id) {
        throw new Error(errorMessage("restaurant"));
      }

      body["restaurant"] = restaurant; //set restaurant found in database
    }

    if (body?.order) {
      // get restaurant required field
      let order = await promotionServices.getOrder(body?.order, token);

      if (!order?._id) {
        throw new Error(errorMessage("order"));
      }

      body["order"] = order; //set order found in database
    }

    print({ body });

    return body;
  } catch (error) {
    throw new Error(error.message);
  }
};
