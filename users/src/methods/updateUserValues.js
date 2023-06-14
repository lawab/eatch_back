const roles = require("../models/roles");
const userServices = require("../services/userServices");
const roleServices = require("../services/roleServices");

module.exports = async (body, req) => {
  try {
    let token = req.token;
    // get author that update current user
    let creator = await userServices.findUser({
      _id: body?._creator,
    });

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
      throw new Error(
        "your cannot update user because you don't have an authorization,please see your administrator!!!"
      );
    }

    if (body?.restaurant) {
      // fetch restaurant since microservice restaurant
      let restaurant = await userServices.getRestaurant(
        body?.restaurant,
        token
      );

      if (restaurant?._id) {
        body["restaurant"] = restaurant;
      } else {
        throw new Error("restaurant not found!!");
      }
    }

    if (body?.laboratory) {
      // fetch laboratory since microservice laboratory
      let laboratory = await userServices.getLaboratory(
        body?.laboratory,
        token
      );
      console.log({ laboratory });

      if (laboratory?._id) {
        body["laboratory"] = laboratory;
      } else {
        throw new Error("laboratory not found!!");
      }
    }

    if (body?.role) {
      let role = body?.role;
      if (Object.values(roles).includes(role)) {
        body["role"] = role;
      } else {
        throw new Error("Role not found!!");
      }
      // fetch restaurant since microservice restaurant
      // let role = await roleServices.findRole({
      //   value: body?.role,
      //   restaurant: body?.restaurant,
      // });
      // if (role) {
      //   body["role"] = role.value;
      // } else {
      //   throw new Error("Role not found!!");
      // }
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
