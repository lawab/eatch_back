/**
 *
 * @param {Object} res [Object Response from express to send response to client if necessary]
 * @param {Object} recetteServices [product microservice to manage product in database]
 * @param {Object} body [Body Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (recetteServices, body, token) => {
  let errorMessage = (field) => `invalid ${field}`;

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
