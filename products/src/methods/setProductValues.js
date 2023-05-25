const roles = require("../models/roles");
const productServices = require("../services/productServices");
/**
 *
 * @param {Object} body [Body from request]
 * @param {Object} req  [request Object from express]
 * @param {String} token [token of user authenticated ]
 * @returns {Promise<Object>}
 */
module.exports = async (body, req, token) => {
  let errorMessage = (field) => `invalid ${field}`;

  try {
    // get user author in database
    let creator = await productServices.getUserAuthor(body?._creator, token);

    if (!creator) {
      throw new Error("invalid author send");
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      throw new Error(
        "your cannot create user because you don't have an authorization!!!"
      );
    }

    // set creator
    body["_creator"] = creator._id;

    // fetch restaurant since microservice restaurant
    let restaurant = await productServices.getRestaurant(
      body?.restaurant,
      token
    );

    if (restaurant?._id) {
      body["restaurant"] = restaurant;
    } else {
      throw new Error("restaurant not found!!");
    }

    // get materials in database
    let materials = await productServices.getMaterials(body?.materials, token);

    if (!materials?.length || materials?.length !== body?.materials?.length) {
      throw new Error(errorMessage("materials"));
    }

    //set materials value found in database
    body["materials"] = materials;

    let category = await productServices.getCategory(body?.category, token);

    if (category?._id) {
      body["category"] = category;
    } else {
      throw new Error("category not found!!");
    }

    // set user avatar
    body["avatar"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";

    console.log({ body });

    return body;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};