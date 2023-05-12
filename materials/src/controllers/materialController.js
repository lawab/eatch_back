const { fieldsRequired } = require("../models/material/material");
const { fieldsValidator } = require("../models/material/validators");
const print = require("../log/print");
const materialServices = require("../services/materialServices");
const roles = require("../models/roles");
const updateForeignFields = require("./updateForeignFields");

// create one Material
const createMaterial = async (req, res) => {
  try {
    let body = req.body;
    // verify fields on body
    let { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

    // if body have invalid fields
    if (!validate) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    // get creator since microservice users
    let creator = await materialServices.getUserAuthor(
      body?._creator,
      req.token
    );

    print({ creator: creator?._id }, "*");

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "invalid data send,you must authenticated to create a raw material!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "you have not authorization to create material,please see you administrator",
      });
    }

    body["_creator"] = creator; //set creator value found in database

    let restaurant = await materialServices.getRestaurant(
      body?.restaurant,
      req.token
    );

    if (!restaurant?._id) {
      return res.status(401).json({
        message: "invalid restaurant value send",
      });
    }

    body["restaurant"] = restaurant; //set restaurant value found in database

    body["image"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png"; //set image for material

    let material = await materialServices.createMaterial(body);

    print({ material }, "*");

    if (material?._id) {
      res
        .status(200)
        .json({ message: "Material has been created successfully!!!" });
    } else {
      res
        .status(200)
        .json({ message: "Material has been not created successfully!!!" });
    }
  } catch (error) {
    print(error, "x");
    return res
      .status(500)
      .json({ message: "Error occured during a creation of Material!!!" });
  }
};

// update Material
const updateMaterial = async (req, res) => {
  try {
    // get body request
    let body = req.body;

    // get the auathor to update Material
    const { validate } = fieldsValidator(Object.keys(body), fieldsRequired);
    if (!validate) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }
    let creator = await materialServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "you don't have authorization to update current material,please see you administrator!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "you have not authorization to update material,please see you administrator",
      });
    }
    let material = await materialServices.findOneMaterial({
      _id: req.params?.id,
    });

    if (!material?._id) {
      return res.status(401).json({
        message: "unable to update material beacuse it not exists!!!",
      });
    }

    body["_creator"] = creator; //update creator who update the current material

    //  update foreign Fields

    body = await updateForeignFields(materialServices, body, req.token);

    // update image url
    body["image"] = req.file ? "/datas/" + req.file?.filename : body["image"]; //update image for material

    // update all valid fields before save it in database
    for (let key in body) {
      material[key] = body[key];
    }

    // update field in database
    let materialsaved = await material.save();

    if (materialsaved?._id) {
      print({ materialsaved: materialsaved }, "ok");
      return res
        .status(200)
        .json({ message: "Material has been updated successfully!!!" });
    } else {
      return res.status(401).json({
        message: "Material has been not updated successfully!!!",
      });
    }
  } catch (error) {
    print(error.message, "x");
    res.status(500).json({
      message: "Error(s) occured during the update Material!!!",
    });
  }
};
// delete one Material
const deleteMaterial = async (req, res) => {
  try {
    let body = req.body;
    // check if creator have authorization
    let creator = await materialServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "Invalid data send: you must authenticated to delete current materail!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "you have not authorization to delete material,please see you administrator",
      });
    }

    // find and delete Material
    let MaterialDeleted = await materialServices.deleteOne(
      {
        _id: req.params?.id,
        deletedAt: null,
      },
      { _creator: creator._id, deletedAt: Date.now() } //set user creator and the date of deletion,no drop Material
    );

    // if Material not exits or had already deleted
    if (!MaterialDeleted) {
      return res
        .status(401)
        .json({ message: "Material not exists or already deleted!!!" });
    }
    if (MaterialDeleted.deletedAt) {
      print({ MaterialDeleted: MaterialDeleted._id }, "s");
      return res
        .status(200)
        .json({ message: "Material has been deleted sucessfully" });
    } else {
      return res.status(500).json({ message: "deletion of Material failed" });
    }
  } catch (error) {
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
    print({ ids: req.params?.ids });
    if (req.params?.ids) {
      let ids = JSON.parse(req.params?.ids);
      let Materials = await materialServices.findMaterials({
        _id: { $in: ids },
      });
      res.status(200).json(Materials);
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
};
