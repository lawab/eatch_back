const print = require("../log/print");

/**
 * @author ulrich <uchokomeny@gmail.com>
 * @param {Object} res [Object Response from express to send response to client if necessary]
 * @param {Object} orderServices [product microservice to manage product in database]
 * @param {Object} body [Body Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (orderServices, body, req) => {
  try {
    let errorMessage = (field) => `invalid ${field}`;

    let token = req.token;

    // set ids list from products
    let productsIds = body?.products?.map((product) => product._id);

    if (!productsIds?.length) {
      throw new Error(errorMessage("products"));
    }

    // get list of products
    let products = await orderServices.getProducts(productsIds, token);

    print({ productsIds, products });

    let productUpdated = products.map((product) => {
      let productFound = body.products.find((p) => p._id === product._id);
      return { ...product, quantity: productFound.quantity };
    });

    print({ productUpdated });

    body["products"] = productUpdated;

    // verify that products has been set successfully
    if (!products?.length || products?.length !== body?.products?.length) {
      throw new Error(errorMessage("products"));
    }

    return body;
  } catch (error) {
    throw new Error(error);
  }
};
