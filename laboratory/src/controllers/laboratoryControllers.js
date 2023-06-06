const LaboratoryServices = require("../services/LaboratoryServices");
const roles = require("../models/roles");
//const { default: mongoose } = require("mongoose");
const UpdateForeignFields = require("../controllers/UpdateForeignFields");
//Create Laboratory in Data Base
const createLaboratory = async (req, res) => {
  try {
    //VERIFICATION DE LIDENTITER DE CELUI QUI CREER LE Laboratory
    let creator = await LaboratoryServices.getUserAuthor(
      req.body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    let body = JSON.parse(req.headers.body);
    //let body = req.body;

    let laboratory = await LaboratoryServices.createLaboratory(body);
    console.log(laboratory);
    if (laboratory) {
      res
        .status(200)
        .json({ message: "Laboratory has been created successfully " });
    } else {
      res.status(401).json({ message: "Laboratory has been not created" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error encounterd creating Laboratory!!!" });
  }
};

const deleteLaboratory = async (req, res) => {
  try {
    let creator = await LaboratoryServices.getUserAuthor(
      req.body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    let deleteLaboratory = await LaboratoryServices.deleteOne(
      {
        _id: req.params?.id,
        deletedAt: null,
      },
      { _creator: req.body._creator, deletedAt: Date.now() }
    );

    // if Laboratory not exits or had already deleted
    if (!deleteLaboratory) {
      return res.json({ message: " Laboratory not exists or already deleted" });
    }
    // Laboratory exits and had deleted successfully
    if (deleteLaboratory.deletedAt) {
      console.log({ deleteLaboratory: deleteLaboratory._id });
      return res
        .status(200)
        .json({ message: "Laboratory has been delete sucessfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd delete Laboratory!!!" });
  }
};

const updateLaboratory = async (req, res) => {
  try {
    let creator = await LaboratoryServices.getUserAuthor(
      req.body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    let body = JSON.parse(req.headers.body);
    //let body = req.body;

    const id = req.params.id;

    let laboratory = await LaboratoryServices.updateLaboratory(id, body);
    if (laboratory) {
      res
        .status(200)
        .json({ message: "Laboratory has been update successfully " });
    } else {
      res.status(401).json({ message: "Laboratory has been not updated" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd updated Laboratory!!!" });
  }
};

const fetchLaboratories = async (req, res) => {
  try {
    let laboratories = await LaboratoryServices.findLaboratories();
    if (laboratories) {
      res.status(200).json(laboratories);
    } else {
      res.status(401).json({ message: "Laboratory has been not fetch" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd fetch Laboratory!!!" });
  }
};

const fetchOneLaboratory = async (req, res) => {
  try {
    let Laboratory = await LaboratoryServices.findLaboratory({
      _id: req.params?.id,
    });
    if (Laboratory) {
      res.status(200).json(Laboratory);
    } else {
      res.status(401).json({ message: "Laboratory has been not fetch" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd fetch Laboratory!!!" });
  }
};

const addProvider = async (req, res) => {
  try {
    let body = req.body;
    console.log(body);
    let owner = await LaboratoryServices.getUserAuthor(
      req.body?.owner,
      req.token
    );
    if (!owner?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    let restaurant = await LaboratoryServices.getRestaurant(
      req.body?.restaurant,
      req.token
    );
    if (!restaurant?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    let material = await LaboratoryServices.getMaterials(
      req.body?.material,
      req.token
    );
    if (!material?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    //let body = JSON.parse(req.headers.body);

    const laboId = req.params.laboId;
    body.date_provider = Date.now();
    body.owner = owner;
    body.restaurant = restaurant;
    body.material = material;
    console.log(body);
    let laboratory = await LaboratoryServices.addProviderById(laboId, body);
    if (laboratory) {
      res
        .status(200)
        .json({ message: "Laboratory has been add successfully " });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd add Laboratory!!!" });
  }
};

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  createLaboratory,
  deleteLaboratory,
  updateLaboratory,
  fetchLaboratories,
  fetchOneLaboratory,
  addProvider,
  //fetchClients,
};
