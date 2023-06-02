/**
 *
 * @param {Object} res [Object Response from express to send response to client if necessary]
 * @param {Object} RestaurantServices [restaurant microservice to manage restaurant in database]
 * @param {Object} body [Body Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (RestaurantServices, body, token) => {
  {
    // verify the existing of restaurant in database if it's in body request before update it in database
    //if (body?.restaurant) {
    // verify restaurant in database
    let restaurant = await orderServices.getRestaurant(body?.restaurant, token);

    if (!restaurant?._id) {
      throw new Error("Invalid data send");
    }
    body["restaurant"] = restaurant; // update restaurant with value found in database
  }

  // verify the existing of category in database if it's in body request before update it in database
  if (body?.client) {
    let client = await orderServices.getClient(body?.client, token);
    console.log({ client });

    // if client not exists in database
    if (!client?._id) {
      if (!restaurant?._id) {
        throw new Error("Invalid data send");
      }
    }
    body["client"] = client;
  }

  if (body?.products?.length) {
    // set ids list from products
    let productsIds = body?.products;

    if (!productsIds?.length) {
      if (!restaurant?._id) {
        throw new Error("Invalid data send");
      }
    }

    // get list of products
    let products = await orderServices.getProducts(productsIds, token);

    // if products not exists in database
    if (!products?.length) {
      throw new Error("Invalid data send");
    }

    body["products"] = products;
  }

  return body;
};
