const roles = require("../models/roles");
const invoiceServices = require("../services/invoiceServices");
/**
 *
 * @param {Object} body [body request from express]
 * @param {String} token [token to valid authentification of user]
 * @param {Object} req [request object from express]
 * @returns
 */
module.exports = async (body, token, req) => {
  try {
    // get creator since microservice users
    let creator = await invoiceServices.getUserAuthor(body?._creator, token);

    console.log({ creator: creator?._id }, "*");

    if (!creator) {
      throw new Error(
        "invalid data send,you must authenticated to create a invoice!!!"
      );
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      throw new Error(
        "you have not authorization to create invoice,please see you administrator"
      );
    }

    //set creator value found in database
    body["_creator"] = creator;

    // get restaurant before save invoice
    let restaurant = await invoiceServices.getRestaurant(
      body?.restaurant,
      token
    );

    if (!restaurant) {
      throw new Error(
        "unable to create invoice because restaurant not know,please see your administrator,thanks!!!"
      );
    }

    //set restaurant value found in database
    body["restaurant"] = restaurant;

    return body;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
