/**
 *
 * @param {Object} res [Object Response from express to send response to client if necessary]
 * @param {Object} productServices [product microservice to manage product in database]
 * @param {Object} body [Body Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (productServices, body, token) => {
  let errorMessage = (field) => `Invalid ${field}`;

  // if user want to update a restaurant product
  if (body?.restaurant) {
    // get restaurant in database
    let restaurant = await productServices.getRestaurant(
      body?.restaurant,
      token
    );

    if (!restaurant?._id) {
      throw new Error(errorMessage("restaurant"));
    }
    body["restaurant"] = restaurant; // update restaurant with value found in database
  }

  // if user want to update a category product
  if (body?.category) {
    // verify category in database
    let category = await productServices.getCategory(body?.category, token);

    if (!category?._id) {
      throw new Error(errorMessage("category"));
    }
    body["category"] = category; // update category with value found in database
  }

  // if user want to update the raws materials product
  if (body?.materials?.length) {
    // verify category in database
    let materials = await productServices.getMaterials(body?.materials, token);

    if (!materials?.length || materials?.length !== body?.materials?.length) {
      throw new Error(errorMessage("materials"));
    }
    body["materials"] = materials; // update category with value found in database
  }

  return body;
};
