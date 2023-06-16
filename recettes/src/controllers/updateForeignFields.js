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

  if (body?.type === "RESTAURANT") {
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
          unity: Ingredient?.unity ? Ingredient?.unity : "g",
        };
      } else {
        throw new Error(errorMessage("Ingredient"));
      }
    });
    // console.log({ trueengredients });
    body["engredients"] = trueengredients;
  }

  if (body?.type === "LABORATORY") {
    let ids = body?.engredients?.map((engredient) => {
      return engredient.raw_material;
    });

    let raw_materials = [];

    for (const id of ids) {
      let raw = await recetteServices.getRaw(id, token);
      if (!raw) {
        throw new Error("Invalid raw_material received");
      }
      raw_materials.push(raw);
    }

    if (raw_materials.length === 0) {
      throw new Error("Invalid raw_materials received");
    }

    let engredients = raw_materials.map((raw) => {
      let rawIndex = body?.engredients?.findIndex((engredient) => {
        return engredient.raw_material == raw._id;
      });
      if (rawIndex != -1) {
        let Ingredient = body?.engredients[rawIndex];
        return {
          raw_material: raw,
          grammage: Ingredient.grammage,
          unity: Ingredient?.unity ? Ingredient?.unity : "g",
        };
      } else {
        throw new Error(errorMessage("engredients"));
      }
    });

    body["engredients"] = engredients;
  }

  return body;
};
