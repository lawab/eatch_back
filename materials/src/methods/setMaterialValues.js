const roles = require("../models/roles");
const materialServices = require("../services/materialServices");
/**
 *
 * @param {Object} body [Body from request]
 * @param {Object} req  [request Object from express]
 * @param {String} token [token of user authenticated ]
 * @returns {Promise<Object>}
 */
module.exports = async (body, req, token) => {
  try {
    // get creator since microservice users
    let creator = await materialServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
      throw new Error(
        "invalid author send or your cannot create user because you don't have an authorization!!!"
      );
    }

    console.log({ creator: creator._id });

    body["_creator"] = creator._id; //set creator value found in database

    // fetch restaurant since microservice restaurant
    let restaurant = await materialServices.getRestaurant(
      body?.restaurant,
      token
    );

    if (restaurant?._id) {
      body["restaurant"] = restaurant;
    } else {
      throw new Error("restaurant not found!!");
    }

    // set user avatar
    body["image"] = req.file
      ? "/datas/" + req.file.filename
      : "/datas/avatar.png";

    return body;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
