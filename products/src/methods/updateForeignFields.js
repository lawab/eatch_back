const roles = require("../models/roles");
const productServices = require("../services/productServices");
/**
 *
 * @param {Object} body [Body Object from express]
 * @param {String} req [request Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (body, req, token) => {
  try {
    let errorMessage = (field) => `Invalid ${field}`;

    // get the author to update product
    let creator = await productServices.getUserAuthor(
      body?._creator,
      req.token
    );

    console.log({ creator });

    // if product has authorization to update new product
    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
      throw new Error(
        "you cannot create the product please see you admin,thanks!!!"
      );
    }

    body["_creator"] = creator; // set user that make update in database

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

    // if user want to update a category product
    if (body?.category) {
      // verify category in database
      let category = await productServices.getCategory(body?.category, token);

      if (!category?._id) {
        throw new Error(errorMessage("category"));
      }
      body["category"] = category; // update category with value found in database
    }

    // if user want to update the raws recette product
    // if (body?.materials?.length) {
    //   // verify recette in database
    //   let materials = await productServices.getMaterials(
    //     body?.materials,
    //     token
    //   );

    //   if (!materials?.length || materials?.length !== body?.materials?.length) {
    //     throw new Error(errorMessage("materials"));
    //   }
    //   body["materials"] = materials; // update category with value found in database
    // }

    if (body?.recette) {
      // get recette in database
      let recette = await productServices.getRecette(body?.recette, token);

      if (!recette) {
        throw new Error(errorMessage("recette"));
      }
      console.log({ recette });
      //set materials value found in database
      body["recette"] = recette;
    }

    // update avatar if exists
    if (req.file) {
      body["image"] = "/datas/" + req.file.filename;
    }

    return body;
  } catch (error) {
    throw new Error(error.message);
  }
};
