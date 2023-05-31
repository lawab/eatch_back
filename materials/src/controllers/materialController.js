const { fieldsRequired } = require("../models/material/material");
const { fieldsValidator } = require("../models/material/validators");
const print = require("../log/print");
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

    // // get creator since microservice users
    // let creator = await materialServices.getUserAuthor(
    //   body?._creator,
    //   req.token
    // );

    // print({ creator: creator?._id }, "*");

    // if (!creator?._id) {
    //   return res.status(401).json({
    //     message:
    //       "invalid data send,you must authenticated to create a raw material!!!",
    //   });
    // }

    // if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
    //   return res.status(401).json({
    //     message:
    //       "you have not authorization to create material,please see you administrator",
    //   });
    // }

    // body["_creator"] = creator; //set creator value found in database

    // let restaurant = await materialServices.getRestaurant(
    //   body?.restaurant,
    //   req.token
    // );
    // console.log({ restaurant });
    // if (!restaurant?._id) {
    //   return res.status(401).json({
    //     message: "invalid restaurant value send",
    //   });
    // }

    // body["restaurant"] = restaurant; //set restaurant value found in database

    // body["image"] = req.file
    //   ? "/datas/" + req.file?.filename
    //   : "/datas/avatar.png"; //set image for material

    newMaterial = await materialServices.createMaterial(BodyUpdate);

    print({ newMaterial }, "*");

    if (newMaterial) {
      let response = await addElementToHistorical(
        async () => {
          return await materialServices.addMaterialToHistorical(
            newMaterial._creator._id,
            {
              materials: {
                _id: newMaterial._id,
                action: "CREATED",
              },
            },
            req.token
          );
        },
        async () => {
          let elementDeleted = await materialServices.deleteTrustlyMaterial({
            _id: newMaterial?._id,
          });
          print({ elementDeleted });
          return elementDeleted;
        }
      );

      return closeRequest(
        response,
        res,
        "Material has been created successfully!!!",
        "Create Material failed,please try again"
      );
    } else {
      res
        .status(200)
        .json({ message: "Create Material failed,please try again" });
    }
  } catch (error) {
    if (newMaterial) {
      let elementDeleted = await materialServices.deleteTrustlyMaterial({
        _id: newMaterial?._id,
      });
      print({ elementDeleted });
    }

    print(error, "x");

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
    // let body = JSON.parse(req.headers.body);
    let body = req.body;

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

    print({ materialsaved });

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
          print({ materialRestored });
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

      print({ materialRestored });
    }
    print(error.message, "x");
    res.status(500).json({
      message: "Error(s) occured during the update Material!!!",
    });
  }
};

const decrementMaterials = async (req, res) => {
  console.log({ boy: req.body });
  let materials = req.body.materials;
  let materialsUpdated = [];
  for (let index = 0; index < materials.length; index++) {
    const material = materials[index];
    let mat = await materialServices.updateMaterial(
      {
        _id: material._id,
      },
      {
        quantity: material.quantity - 1,
        _creator: material._creator,
      }
    );
    materialsUpdated.push(mat);
  }

  res.status(200).json(materialsUpdated);
};

const restoreMaterials = async (req, res) => {
  console.log({ boy: req.body });
  let materials = req.body.materials;
  let materialsUpdated = [];
  for (let index = 0; index < materials.length; index++) {
    const material = materials[index];
    let mat = await materialServices.updateMaterial(
      {
        _id: material._id,
      },
      {
        ...material,
      }
    );
    materialsUpdated.push(mat);
  }

  res.status(200).json(materialsUpdated);
};

// delete one Material
const deleteMaterial = async (req, res) => {
  let materialCopy = null;
  let MaterialDeleted = null;
  try {
    let body = req.body;
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

    print({ MaterialDeleted });

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
          print({ materialRestored });
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
      print({ materialRestored });
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
    print(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// get Materials
const fetchMaterials = async (req, res) => {
  try {
    // print({ ids: req.params?.ids });
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
