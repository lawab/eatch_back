const roles = require("../models/roles");
const userServices = require("../services/userServices");
const roleServices = require("../services/roleServices");

const cryptoJS = require("crypto-js");

/**
 *
 * @param {Object} body [Body from request]
 * @param {Object} req  [request Object from express]
 * @param {String} token [token of user authenticated ]
 * @returns {Promise<Object>}
 */
module.exports = async (body, req, token) => {
  try {
    // get user author in database
    let creator = await userServices.findUser({
      _id: body?._creator,
    });

    if (!creator) {
      throw new Error("invalid author send");
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      throw new Error(
        "your cannot create user because you don't have an authorization!!!"
      );
    }

    // fetch restaurant since microservice restaurant
    let restaurant = await userServices.getRestaurant(body?.restaurant, token);

    if (restaurant?._id) {
      body["restaurant"] = restaurant;
    } else {
      throw new Error("restaurant not found!!");
    }

    // get role in database

    // fetch restaurant since microservice restaurant
    // let role = await roleServices.findRole({
    //   _id: body?.role,
    //   restaurant: body?.restaurant,
    // });

    let role = body?.role;
    if (Object.values(roles).includes(role)) {
      body["role"] = role;
    } else {
      throw new Error("Role not found!!");
    }

    // set password encrypt

    body["password"] = cryptoJS.AES.encrypt(
      body?.password,
      process.env.PASS_SEC
    ).toString();

    // set creator
    body["_creator"] = creator._id;

    // set user avatar
    body["avatar"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";

    //set username
    body["username"] = [body["firstName"], body["lastName"]].join(" ");

    return body;
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
};
