const LaboratoryServices = require("../services/LaboratoryServices");
const rawServices = require('../services/rawServices')
const materialServices = require('../services/materialServices')
const providerServices = require('../services/providerServices')
const api_consumer = require('../services/api_consumer')
const roles = require("../models/roles");
//const { default: mongoose } = require("mongoose");
const UpdateForeignFields = require("../controllers/UpdateForeignFields");
//Create Laboratory in Data Base
const createLaboratory = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    //VERIFICATION DE LIDENTITER DE CELUI QUI CREER LE Laboratory
    let creator = await LaboratoryServices.getUserAuthor(
      body?._creator,
      req.token
    );
    if (!creator?._id) {
      console.log("invalid data send!!!");
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }
     body.image = req.file ? "/datas/" + req.file.filename : "";
    console.log("###########################")
    console.log(body)

    let laboratory = await LaboratoryServices.createLaboratory(body);
    console.log(laboratory);
    if (laboratory) {
      res
        .status(200)
        .json({ message: "Laboratory has been created successfully " });
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
    res.status(500).json({ "message": "Error encounterd fetch Laboratory!!!" });
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
        "message": "invalid data send!!!",
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
    // console.log(body);
    let laboratory = await LaboratoryServices.addProviderById(laboId, body);
    if (laboratory) {
      res
        .status(200)
        .json({ "message": "Laboratory has been add successfully " });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ "message": "Error encounterd add Laboratory!!!" });
  }
};


const addRequestingToLaboratory = async (req, res) => {
  try {
    const body = req.body
    const laboratory = await LaboratoryServices.requestMaterialFromRestaurantById(req.params.laboratoryId, body)
    if (laboratory) {
      // console.log("Laboratory***********************");
      // console.log(laboratory);
      res
        .status(200)
        .json({ message: "Request has been added successfully " });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd add Laboratory!!!" });
  }
};

const validateRequestingToLaboratory = async (req, res) => {
  try {
    
    //let body = JSON.parse(req.headers.body)
    let body = req.body //TO TEST LOCALLY
    console.log("BBBBBBBBBBBBBBOOOOOOOOOOOOOOOODDDDDDDDYYYYY: ")
    console.log(body)
    let validated = false
    const date_now = Date.now()
    const laboratory = await LaboratoryServices.validateRequestFromRestaurantById(body)
    if (!laboratory) {
      return res.status(401).json({message: "Validation not done!!! "})
    }
    const materialFound = await materialServices.getMaterialById(body.materialId)
    if (!materialFound) {
      return res.status(401).json({message: "Material Not found!!! "})
    }
    // console.log("QUANTITE: ", body.qte, materialFound.quantity);
    if (body.choice == "accepted") {
      validated = true
      const qte = {
        quantity: materialFound.quantity - parseInt(body.qte),
      };
      const material = await materialServices.updateMaterialById(
        body.materialId,
        qte
      );
      if (!material) {
        return res.status(401).json({ message: "Material Not updated!!! " });
      }
    }

    const validateBody = {
      validated: validated,
      requestId: body.requestId,
      date_validated: date_now,
    };
    console.log("111111111111111111validateBody");
    console.log(validateBody)
    console.log("validateBody2222222222222");
    const validation = await api_consumer.validateRequestingByRestaurantId(body.restaurantId, validateBody)
    if (!validation) {
      return res.status(401).json({ message: "Validation Not done!!! " });
    }
      // console.log("Laboratory***********************");
      // console.log(laboratory);
      res
        .status(200)
        .json({ message: "Request has been validated successfully " });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd validating Request!!!" });
  }
};

//Update Providing Laboratory by Id from Provider Id with Raw materials
const updateProvidingLaboratory = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    const laboratory = await LaboratoryServices.getLaboratoryById(body.laboratoryId);
    if (!laboratory) {
      return res.status(401).json({"message" : "Laboratory not found!!!"})
    }
    const raw = await rawServices.getRawById(body.rawId);
    if (!raw) {
      return res.status(401).json({ "message": "Raw material not found!!!" });
    }
    const provider = await providerServices.getProviderById(body.providerId);
    if (!provider) {
      return res.status(401).json({ "message": "Provider not found!!!" });
    }
    const provideBody = {
      raw: raw.id,
      provider: provider.id,
      grammage: body?.qte,
    };
    const providing = await LaboratoryServices.providingLaboratoryById(laboratory.id, provideBody)
    const rawBody = {
      available: raw.available + parseInt(body.qte),
    };
    const rawUpdated = await rawServices.updateRawById(raw.id, rawBody);
    if (!rawUpdated) {
      return res.status(401).json({ "message": "Raw not updated!!!" });
    }
    res.status(200).json({ "message": "Laboratory has been providing successfully " });
  }
  catch (err) {
     console.log(err);
     res.status(500).json({ "message": "Error encounterd providing Laboratory!!!" });
  }
  
};

//Update Manufacturing Laboratory by Id from Provider Id with materials
const updateManufacturingLaboratory = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    const laboratory = await LaboratoryServices.getLaboratoryById(body.laboratoryId);
    if (!laboratory) {
      return res.status(401).json({"message" : "Laboratory not found!!!"})
    }
    const material = await materialServices.getMaterialById(body.materialId);
    if (!material) {
      return res.status(401).json({ "message": "Raw material not found!!!" });
    }
    const manufacturingBody = {
      material: material.id,
      qte: body?.qte,
    };
    const providing = await LaboratoryServices.manufacturingLaboratoryById(laboratory.id, manufacturingBody)
    const materialBody = {
      quantity: material.quantity + parseInt(body.qte),
    };
    const materialUpdated = await materialServices.updateMaterialById(material.id, materialBody);
    if (!materialUpdated) {
      return res.status(401).json({ message: "Raw not updated!!!" });
    }
    res.status(200).json({ "message": "Laboratory has been providing successfully " });
  }
  catch (err) {
     console.log(err);
     res.status(500).json({ "message": "Error encounterd providing Laboratory!!!" });
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
  updateProvidingLaboratory,
  updateManufacturingLaboratory,
  addRequestingToLaboratory,
  validateRequestingToLaboratory,
  //fetchClients,
};
