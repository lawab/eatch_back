/**
 * @author <uchokomeny@gmail.com>
 * @param {Object} res [Object Response from express to send response to client if necessary]
 * @param {Object} menuServices [menu microservice to manage menu in database]
 * @param {Object} body [Body Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Object>} [Body object updated]
 */
module.exports = async (menuServices, body, token) => {
  let errorMessage = (field) => `Invalid ${field}`;

  // if user want to update a restaurant menu
  if (body?.restaurant) {
    // get restaurant in database
    let restaurant = await menuServices.getRestaurant(body?.restaurant, token);

    if (!restaurant?._id) {
      throw new Error(errorMessage("restaurant"));
    }
    body["restaurant"] = restaurant; // update restaurant with value found in database
  }

  if (body?.products?.length) {
    //   get products in databsase
    let products = await menuServices.getProducts(body?.products, token);

    if (!products?.length || products?.length !== body?.products?.length) {
      throw new Error(errorMessage("products"));
    }

    body["products"] = products; //set products values found in database
  }

  return body;
};
