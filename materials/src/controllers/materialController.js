const materialServices = require("../services/materialServices");
const roles = require("../models/roles");
const updateForeignFields = require("./updateForeignFields");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");
const setMaterialValues = require("../methods/setMaterialValues");

// create one Material
const createMaterial = async (req, res) => {
  let newMaterial = null;
  try {
    let body = JSON.parse(req.headers.body);

    console.log({ body });

    let BodyUpdate = await setMaterialValues(body, req, req.token);

    newMaterial = await materialServices.createMaterial(BodyUpdate);

    console.log({ newMaterial }, "*");

    if (newMaterial) {
    //   let response = await addElementToHistorical(
    //     async () => {
    //       return await materialServices.addMaterialToHistorical(
    //         newMaterial._creator._id,
    //         {
    //           materials: {
    //             _id: newMaterial._id,
    //             action: "CREATED",
    //           },
    //         },
    //         req.token
    //       );
    //     },
    //     async () => {
    //       let elementDeleted = await materialServices.deleteTrustlyMaterial({
    //         _id: newMaterial?._id,
    //       });
    //       console.log({ elementDeleted });
    //       return elementDeleted;
    //     }
    //   );

    //   return closeRequest(
    //     response,
    //     res,
    //     "Material has been created successfully!!!",
    //     "Create Material failed,please try again"
    //   );
    // } else {
    //   res
    //     .status(200)
    //     .json({ message: "Create Material failed,please try again" });
      res.status(200).json({"message" : "Material created successfully!!!"})
    }
  } catch (error) {
    // if (newMaterial) {
    //   let elementDeleted = await materialServices.deleteTrustlyMaterial({
    //     _id: newMaterial?._id,
    //   });
    //   console.log({ elementDeleted });
    // }

    console.log(error, "x");

    return res
      .status(500)
      .json({ message: "Error occured during a creation of Material!!!" });
  }
};

// update Material
const updateMaterial = async (req, res) => {
  let materialCopy = null;
  let materialsaved = null;

  try {
    // get body request
    let body = JSON.parse(req.headers.body);
    // let body = req.body;

    let BodyUpdated = await updateForeignFields(body, req, req.token);

    let material = await materialServices.findOneMaterial({
      _id: req.params?.id,
    });

    if (!material) {
      return res.status(401).json({
        message: "unable to update material beacuse it not exists!!!",
      });
    }

    console.log({ material });

    // cppy documment before update it
    materialCopy = Object.assign({}, material._doc);

    // update all valid fields before save it in database
    for (let key in body) {
      material[key] = BodyUpdated[key];
    }

    // update field in database
    materialsaved = await material.save();

    console.log({ materialsaved });

    if (materialsaved?._id) {
      let response = await addElementToHistorical(
        async () => {
          return await materialServices.addMaterialToHistorical(
            materialsaved._creator._id,
            {
              materials: {
                _id: materialsaved._id,
                action: "UPDATED",
              },
            },
            req.token
          );
        },
        async () => {
          for (const field in materialCopy) {
            if (Object.hasOwnProperty.call(materialCopy, field)) {
              materialsaved[field] = materialCopy[field];
            }
          }

          // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          let materialRestored = await materialsaved.save({
            timestamps: false,
          });
          console.log({ materialRestored });
          return materialRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "Material has been updated successfully!!!",
        "Material has not been Updated successfully,please try again later,thanks!!!"
      );
    } else {
      return res.status(401).json({
        message: "Material has been not updated successfully!!!",
      });
    }
  } catch (error) {
    if (materialCopy && materialsaved) {
      for (const field in materialCopy) {
        if (Object.hasOwnProperty.call(materialCopy, field)) {
          materialsaved[field] = materialCopy[field];
        }
      }

      // restore Object in database,not update timestamps because it is restoration from olds values fields in database
      let materialRestored = await materialsaved.save({
        timestamps: false,
      });

      console.log({ materialRestored });
    }
    console.log(error.message, "x");
    res.status(500).json({
      message: "Error(s) occured during the update Material!!!",
    });
  }
};

const decrementMaterials = async (req, res) => {
  try {
    console.log({ boy: req.body });
    let materials = req.body.materials;
    let materialsUpdated = [];

    for (const _id in materials) {
      if (materials.hasOwnProperty(_id)) {
        let element = materials[_id];
        let mat = await materialServices.findMaterial({
          _id,
        });

        mat.quantity = mat.quantity - element.count;

        let matUpd = await mat.save();

        materialsUpdated.push(matUpd);
      }
    }
    res.status(200).json(materialsUpdated);
  } catch (error) {
    res.status(500).json({ message: "Error occured during decrementation!!!" });
  }
};

const restoreMaterials = async (req, res) => {
  try {
    console.log({ boy: req.body });
    let materials = req.body.materials;
    let materialsUpdated = [];

    for (const _id in materials) {
      if (materials.hasOwnProperty(_id)) {
        let element = materials[_id];
        let mat = await materialServices.findMaterial({
          _id,
        });

        mat.quantity = element.quantity;
        mat.createdAt = element.createdAt;
        mat.updatedAt = element.updatedAt;

        let matUpd = await mat.save();

        materialsUpdated.push(matUpd);
      }
    }
    res.status(200).json(materialsUpdated);
  } catch (error) {
    res.status(500).json({ message: "Error occured during restoration!!!" });
  }
};

// delete one Material
const deleteMaterial = async (req, res) => {
  let materialCopy = null;
  let MaterialDeleted = null;
  try {
    let body = JSON.parse(req.headers.body);
    // check if creator have authorization
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
          "you have not authorization to delete material,please see you administrator",
      });
    }

    let material = await materialServices.findOneMaterial({
      _id: req.params?.id,
      deletedAt: null,
    });

    if (!material) {
      return res.status(401).json({
        message:
          "unable to update material beacuse it not exists or already deleted!!!",
      });
    }

    console.log({ material });

    // cppy documment before update it
    materialCopy = Object.assign({}, material._doc);

    //update deleteAt and cretor fields from material
    material.deletedAt = Date.now();
    material._creator = creator._id;

    MaterialDeleted = await material.save();

    console.log({ MaterialDeleted });

    if (MaterialDeleted.deletedAt) {
      let response = await addElementToHistorical(
        async () => {
          let response = await materialServices.addMaterialToHistorical(
            MaterialDeleted._creator._id,
            {
              materials: {
                _id: MaterialDeleted._id,
                action: "DELETED",
              },
            },
            req.token
          );

          return response;
        },
        async () => {
          // restore only fields would had changed in database
          MaterialDeleted["deletedAt"] = materialCopy["deletedAt"];
          MaterialDeleted["updatedAt"] = materialCopy["updatedAt"];
          MaterialDeleted["createdAt"] = materialCopy["createdAt"];

          let materialRestored = await MaterialDeleted.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          console.log({ materialRestored });
          return materialRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "Material has been delete successfully!!!",
        "Material has not been delete successfully,please try again later,thanks!!!"
      );
    } else {
      return res.status(500).json({ message: "deletion of Material failed" });
    }
  } catch (error) {
    if (MaterialDeleted && materialCopy) {
      // restore only fields would had changed in database
      MaterialDeleted["deletedAt"] = materialCopy["deletedAt"];
      MaterialDeleted["updatedAt"] = materialCopy["updatedAt"];
      MaterialDeleted["createdAt"] = materialCopy["createdAt"];

      let materialRestored = await MaterialDeleted.save({
        timestamps: false,
      }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
      console.log({ materialRestored });
    }
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error(s) occured during the deletion of Material!!!" });
  }
};
// fetch one material in database
const fetchMaterial = async (req, res) => {
  try {
    let Material = await materialServices.findMaterial({
      _id: req.params?.id,
    });
    res.status(200).json(Material);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// get Materials
const fetchMaterials = async (req, res) => {
  try {
    // console.log({ ids: req.params?.ids });
    let materials = [];
    if (req.params?.ids) {
      let ids = JSON.parse(req.params?.ids);

      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        let material = await materialServices.findMaterial({
          _id: id,
        });
        materials.push(material);
      }

      res.status(200).json(materials);
    } else {
      let Materials = await materialServices.findMaterials();
      res.status(200).json(Materials);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch Materials by restaurant
const fetchMaterialsByRestaurant = async (req, res) => {
  try {
    let Materials = await materialServices.findMaterials({
      "restaurant._id": req.params?.id,
    });
    res.status(200).json(Materials);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

module.exports = {
  createMaterial,
  deleteMaterial,
  fetchMaterials,
  updateMaterial,
  fetchMaterial,
  fetchMaterialsByRestaurant,
  decrementMaterials,
  restoreMaterials,
};
