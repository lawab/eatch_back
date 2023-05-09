/**
 *
 * @param {Object} res [Object Response from express to send response to client if necessary]
 * @param {Object} materialServices [product microservice to manage product in database]
 * @param {Object} body [Body Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (materialServices, body, token) => {
  let errorMessage = (field) => `Invalid ${field}`;

  // if user want to update a restaurant product
  if (body?.restaurant) {
    // get restaurant in database
    let restaurant = await materialServices.getRestaurant(
      body?.restaurant,
      token
    );

    if (!restaurant?._id) {
      throw new Error(errorMessage("restaurant"));
    }
    body["restaurant"] = restaurant; // update restaurant with value found in database
  }

  return body;
};
