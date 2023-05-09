const productServices = require("../services/productServices");

/**
 * @author <uchokomeny@gmail.com>
 * @param {{restaurant_id:String,category_id:String,materila_ids:[String]}} firstParam [id restaurant and array of materials will fetch in database]
 * @param {String} token [the token to validate user session]
 * @param {Object} body [body object that content the foreign fields]
 * @returns {Promise<Array<Object>>} [return turple,first value it's the restaurant value, second value it's the categroy value and third value it's the materials value]
 */
module.exports = async (
  { restaurant_id = null, category_id = null, materila_ids = [] },
  token,
  body
) => {
  try {
    let errorMessage = (field) => `invalid ${field}`;
    // get materials in database
    let materials = await productServices.getMaterials(materila_ids, token);

    if (!materials?.length || materials?.length !== body?.materials?.length) {
      throw new Error(errorMessage("materials"));
    }
    body["materials"] = materials; //set materials value found in database

    // get restaurant in database
    let restaurant = await productServices.getRestaurant(restaurant_id, token);

    if (!restaurant?._id) {
      throw new Error(errorMessage("restaurant"));
    }
    body["restaurant"] = restaurant; //set restaurant value found in database

    // get categrory in database
    let category = await productServices.getCategory(category_id, token);

    if (!category?._id) {
      throw new Error(errorMessage("category"));
    }
    body["category"] = category; //set category value found in database

    return body;
  } catch (error) {
    throw new Error(error.message);
  }
};
