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

    if (body?.products) {
      let productsIds = body?.products?.map((p) => p);
      // get list of products
      let products = await orderServices.getProducts(productsIds, token);

      console.log({ products });

      let invalidProducts = products.filter((el) => !el?._id);

      // verify that products has been set successfully
      if (
        !products?.length ||
        products?.length !== body?.products?.length ||
        invalidProducts?.length
      ) {
        throw new Error(errorMessage("products"));
      }

      body["products"] = products;
    }

    return body;
  } catch (error) {
    throw new Error(error);
  }
};
