const { default: mongoose } = require("mongoose");

/**
 *
 * @param {Object} res [Object Response from express to send response to material if necessary]
 * @param {Object} recetteServices [product microservice to manage product in database]
 * @param {Object} body [Body Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (recetteServices, body, token) => {
  let errorMessage = (field) => `invalid ${field}`;

  // verify restaurant in database
  let restaurant = await recetteServices.getRestaurant(body?.restaurant, token);

  if (!restaurant?._id) {
    throw new Error(errorMessage("restaurant"));
  }
  body["restaurant"] = restaurant; // update restaurant with value found in database
  console.log({ restaurant });

  // verify the existing of category in database if it's in body request before update it in database
  //recuperer les identifiants

  /*engredients:
     [
      {
        material: 645ceed8df03070b4d61b518
        grammage: 100
      },
    ]*/

  let ids = body?.engredients?.map((engredient) => {
    return engredient.material;
  });

  let materials = await recetteServices.getMaterials(ids, token);
  console.log({ materials });

  // if material not exists in database
  if (materials?.length != ids.length) {
    throw new Error(errorMessage("Ingredient"));
  }
  // formation des ingredients
  let trueengredients = materials.map((material) => {
    let index = body?.engredients?.findIndex((engredient) => {
      return engredient.material == material._id;
    });
    if (index != -1) {
      let Ingredient = body?.engredients[index];
      return {
        material,
        grammage: Ingredient.grammage,
      };
    } else {
      throw new Error(errorMessage("Ingredient"));
    }
  });

  console.log({ trueengredients });
  body["engredients"] = trueengredients;

  return body;
};
