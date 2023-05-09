/**
 * @author <uchokomeny@gmail.com>
 * @param {Object} res [Object Response from express to send response to client if necessary]
 * @param {Object} menuServices [product microservice to manage product in database]
 * @param {Object} body [Body Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Object>}
 */
module.exports = async (menuServices, body, token) => {
  let errorMessage = (field) => `Invalid ${field}`;

  //   get restaurant in databsase
  let restaurant = await menuServices.getRestaurant(body?.restaurant, token);

  if (!restaurant?._id) {
    throw new Error(errorMessage("restaurant"));
  }

  body["restaurant"] = restaurant; //set restaurant value found in database

  //   get products in databsase
  let products = await menuServices.getProducts(body?.products, token);

  if (!products?.length || products?.length !== body?.products?.length) {
    throw new Error(errorMessage("products"));
  }

  body["products"] = products; //set product value found in database

  return body;
};
