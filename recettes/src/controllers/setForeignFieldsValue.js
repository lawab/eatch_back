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

  let materialsEngrediants = [];

  let rawEngredients = [];

  let engredientFiltered = [];

  for (e of body?.engredients) {
    if (e.type === "material") {
      engredientFiltered.push({
        material: e.material,
        grammage: e.grammage,
        unity: e?.unity ? e.unity : "g",
      });
    }
    if (e.type === "raw_material") {
      engredientFiltered.push({
        raw_material: e.raw_material,
        grammage: e.grammage,
        unity: e?.unity ? e.unity : "g",
      });
    }
  }

  let _materials = engredientFiltered.filter((engredient) => {
    return engredient?.material;
  });

  let rawMaterials = engredientFiltered.filter((engredient) => {
    return engredient?.raw_material;
  });

  console.log({ _materials, rawMaterials });

  let materialIds = _materials.map((e) => e?.material);

  let rawMaterialIds = rawMaterials.map((e) => e?.raw_material);

  if (materialIds.length) {
    let materials = await recetteServices.getMaterials(materialIds, token);
    console.log({ materials });
    // formation des ingredients
    materialsEngrediants = materials.map((material) => {
      let index = _materials.findIndex((engredient) => {
        return engredient.material == material._id;
      });
      if (index != -1) {
        let Ingredient = _materials[index];
        return {
          material,
          grammage: Ingredient.grammage,
          unity: Ingredient?.unity ? Ingredient?.unity : "g",
        };
      } else {
        throw new Error(errorMessage("engredient"));
      }
    });
    console.log({ materialsEngrediants });
  }

  if (rawMaterialIds.length) {
    let raw_materials = [];

    for (const id of rawMaterialIds) {
      let raw = await recetteServices.getsemiRaw(id, token);
      if (!raw) {
        throw new Error("Invalid raw_material received");
      }
      raw_materials.push(raw);
    }

    if (raw_materials.length === 0) {
      throw new Error("Invalid raw_materials received");
    }

    rawEngredients = raw_materials.map((raw) => {
      let rawIndex = rawMaterials.findIndex((engredient) => {
        return engredient.raw_material == raw._id;
      });
      if (rawIndex != -1) {
        let Ingredient = rawMaterials[rawIndex];
        return {
          raw_material: raw,
          grammage: Ingredient.grammage,
          unity: Ingredient?.unity ? Ingredient?.unity : "g",
        };
      } else {
        throw new Error(errorMessage("engredients"));
      }
    });
    console.log({ rawEngredients });
  }

  body["engredients"] = [...materialsEngrediants, ...rawEngredients];

  return body;
};
