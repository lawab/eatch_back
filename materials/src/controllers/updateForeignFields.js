const roles = require("../models/roles");
const materialServices = require("../services/materialServices");

/**
 *
 * @param {Object} res [Object Response from express to send response to client if necessary]
 * @param {Object} body [Body Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (body, req, token) => {
  try {
    let errorMessage = (field) => `Invalid ${field}`;

    let creator = await materialServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
      return res.status(401).json({
        message:
          "you have not authorization to update material,please see you administrator",
      });
    }

    //update creator who update the current material
    body["_creator"] = creator;

    // get restaurant in database
    let restaurant = await materialServices.getRestaurant(
      body?.restaurant,
      token
    );

    if (!restaurant) {
      throw new Error(errorMessage("restaurant"));
    }

    body["restaurant"] = restaurant; // update restaurant with value found in database

    if (req.file) {
      body["image"] = "/datas/" + req.file?.filename;
    }

    return body;
  } catch (error) {
    throw new Error(error.message);
  }
};
