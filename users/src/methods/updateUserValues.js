const roles = require("../models/roles");
const userServices = require("../services/userServices");

module.exports = async (body, req) => {
  try {
    let token = req.token;
    // get author that update current user
    let creator = await userServices.findUser({
      _id: body?._creator,
    });

    // fetch restaurant since microservice restaurant
    let restaurant = await userServices.getRestaurant(body?.restaurant, token);

    if (restaurant?._id) {
      body["restaurant"] = restaurant;
    } else {
      throw new Error("restaurant not found!!");
    }

    if (!creator) {
      throw new Error("you must authenticated to update current user!!!");
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      throw new Error(
        "your cannot update user because you don't have an authorization,please see your administrator!!!"
      );
    }

    // set user that make update in database
    body["_creator"] = creator._id;

    // update avatar if exists
    if (req.file) {
      body["avatar"] = "/datas/" + req.file?.filename;
    }

    return body;
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
};
