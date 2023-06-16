const roles = require("../models/roles");
const promotionServices = require("../services/promotionServices");

/**
 *
 * @param {Object} body [Object body receive since request]
 * @param {String} token [to authenticate user session]
 * @returns {Promise<Object>} body [updated Object body receive since request]
 */
module.exports = async (req, body, token) => {
  try {
    let errorMessage = (field) => `invalid ${field}`;

    let creator = await promotionServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
      throw new Error(
        "your cannot create promotion element because you don't have an authorization,please see your administrator"
      );
    }

    //set creator found in database
    body["_creator"] = creator;

    // get restaurant required field
    let restaurant = await promotionServices.getRestaurant(
      body?.restaurant,
      token
    );

    if (!restaurant) {
      throw new Error(errorMessage("restaurant"));
    }

    body["restaurant"] = restaurant; //set restaurant found in database

    if (body?.product) {
      // get product field if exist required field
      let product = await promotionServices.getProduct(body?.product, token);

      if (!product) {
        throw new Error(errorMessage("product"));
      }
      //set order found in database
      body["product"] = product;
    }

    if (body?.menu) {
      // get product field if exist required field
      let menu = await promotionServices.getMenu(body?.menu, token);

      if (!menu) {
        throw new Error(errorMessage("menu"));
      }
      //set order found in database
      body["menu"] = menu;
    }

    // set promotion avatar
    body["image"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";

    return body;
  } catch (error) {
    throw new Error(error.message);
  }
};
