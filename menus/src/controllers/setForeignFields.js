const roles = require("../models/roles");
const menuServices = require("../services/menuServices");
/**
 * @author <uchokomeny@gmail.com>
 * @param {Object} body [Body Object from express]
 * @param {Object} req [Object request from express to send response to client if necessary]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Object>}
 */
module.exports = async (body, req, token) => {
  let errorMessage = (field) => `Invalid ${field}`;
  try {
    // get creator since microservice users
    let creator = await menuServices.getUserAuthor(body?._creator, token);

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
      throw new Error(
        errorMessage(
          "you have not authorization to create menu,please see you administrator"
        )
      );
    }

    body["_creator"] = creator; //set creator value found in database

    console.log({ creator: creator?._id });

    //   get restaurant in databsase
    let restaurant = await menuServices.getRestaurant(body?.restaurant, token);

    if (!restaurant?._id) {
      throw new Error(errorMessage("restaurant"));
    }

    body["restaurant"] = restaurant; //set restaurant value found in database

    // let products = await menuServices.getProducts(body?.products, token);

    // if (!products?.length || products?.length !== body?.products?.length) {
    //   throw new Error(errorMessage("products"));
    // }

    // get products in databsase
    let products = await menuServices.getProducts(
      JSON.parse(body?.products),
      token
    );
    if (
      !products?.length ||
      products?.length !== JSON.parse(body?.products)?.length
    ) {
      throw new Error(errorMessage("products"));
    }

    body["products"] = products; //set product value found in database

    //   get category in databsase
    let category = await menuServices.getCategory(body?.category, token);

    if (!category) {
      throw new Error(errorMessage("category"));
    }

    body["category"] = category;

    // set user avatar
    body["image"] = req.file
      ? "/datas/" + req.file.filename
      : "/datas/avatar.png";
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

  return body;
};
