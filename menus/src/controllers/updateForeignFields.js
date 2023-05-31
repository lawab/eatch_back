const roles = require("../models/roles");
const menuServices = require("../services/menuServices");

/**
 * @author <uchokomeny@gmail.com>
 * @param {Object} body [Body Object from express]
 * @param {Object} req [Object Request from express to send response to client if necessary]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Object>} [Body object updated]
 */
module.exports = async (body, req, token) => {
  let errorMessage = (field) => `Invalid ${field}`;

  try {
    // if user want to update a restaurant menu

    let creator = await menuServices.getUserAuthor(body?._creator, token);

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "you don't have authorization to update current menu,please see you administrator!!!",
      });
    }

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
      throw new Error(
        "you have not authorization to update menu,please see you administrator"
      );
    }

    body["_creator"] = creator; //update creator who update the current menu

    // get restaurant in database
    let restaurant = await menuServices.getRestaurant(body?.restaurant, token);

    if (!restaurant) {
      throw new Error(errorMessage("restaurant"));
    }
    body["restaurant"] = restaurant; // update restaurant with value found in database

    if (body?.products?.length) {
      //   get products in databsase
      // let products = await menuServices.getProducts(body?.products, token);

      // if (!products?.length || products?.length !== body?.products?.length) {
      //   throw new Error(errorMessage("products"));
      // }
      let products = await menuServices.getProducts(body?.products, token);

      if (!products?.length || products?.length !== body?.products?.length) {
        throw new Error(errorMessage("products"));
      }

      body["products"] = products; //set products values found in database
    }

    if (body?.category) {
      //   get category in databsase
      let category = await menuServices.getCategory(body?.category, token);

      if (!category) {
        throw new Error(errorMessage("category"));
      }

      body["category"] = category;
    }

    // update avatar if exists
    if (req.file) {
      body["image"] = "/datas/" + req.file?.filename;
    }

    return body;
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
};
