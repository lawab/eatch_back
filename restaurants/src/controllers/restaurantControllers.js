const RestaurantServices = require("../services/RestaurantServices");
const roles = require("../models/roles");
//const { default: mongoose } = require("mongoose");
const UpdateForeignFields = require("../controllers/UpdateForeignFields");

const api_consumer = require('../services/api_consumer');
//Create restaurant in Data Base
const createRestaurant = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    //let body = req.body;
    //VERIFICATION DE LIDENTITER DE CELUI QUI CREER LE RESTAURANT
    let creator = await RestaurantServices.getUserAuthor(
      body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    //let body = req.body;
    let infos = {
      town: body?.town,
      address: body?.address,
      logo: req.file ? "/datas/" + req.file.filename : "/datas/avatar.png",
    };
    let restaurantBody = {
      restaurant_name: body?.restaurant_name,
      infos: infos,
      _creator: body?._creator,
    };

    let restaurant = await RestaurantServices.createRestaurant(restaurantBody);
    if (restaurant) {
      res
        .status(200)
        .json({ message: "restaurant has been created successfully " });
    } else {
      res.status(401).json({ message: "restaurant has been not created" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error encounterd creating restaurant!!!" });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    let creator = await RestaurantServices.getUserAuthor(
      req.body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    let deleteRestaurant = await RestaurantServices.deleteOne(
      {
        _id: req.params?.id,
        deletedAt: null,
      },
      { _creator: req.body._creator, deletedAt: Date.now() }
    );

    // if restaurant not exits or had already deleted
    if (!deleteRestaurant) {
      return res
        .status(401)
        .json({ message: " restaurant not exists or already deleted" });
    }
    // restaurant exits and had deleted successfully
    if (deleteRestaurant.deletedAt) {
      console.log({ deleteRestaurant: deleteRestaurant._id });
      return res
        .status(200)
        .json({ message: "restaurant has been delete sucessfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd delete restaurant!!!" });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    const id = req.params.id;
    //let body = req.body;
    let creator = await RestaurantServices.getUserAuthor(
      body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }
    const restaurantFound = await RestaurantServices.getRestaurantById(id)
    if (!restaurantFound) {
      return res.status(401).json({message : "Restaurant not found!!!"})
    }
    //let body = req.body;
    let infos = {
      town: body?.town,
      address: body?.address,
    };
    if(req.file){
      infos.logo = "/datas/" + req.file.filename
    }
   
    let restaurantBody = {
      restaurant_name: body?.restaurant_name,
      infos: infos,
      _creator: body?._creator,
    };

    

    let restaurant = await RestaurantServices.updateRestaurant(
      id,
      restaurantBody
    );
    if (restaurant) {
      res
        .status(200)
        .json({ message: "restaurant has been update successfully " });
    } else {
      res.status(401).json({ message: "restaurant has been not updated" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd updated restaurant!!!" });
  }
};

const validateRequest = async (req, res) => {
  try {
    console.log("IDDDD: ", req.params.restaurantId);
    const body = req.body
    console.log("+++++++++++++++body");
    console.log(body);
    console.log("validate***************");
    let restaurant = await RestaurantServices.getRestaurantById(req.params.restaurantId)
    if (!restaurant) {
      return res.status(401).json({ message: "restaurant has not been found!!!" });
    }
    console.log("************validate###########");
    console.log("****************",restaurant);
    const validation = await RestaurantServices.validateOrAcceptMaterialById(req.params.restaurantId, body)
    if (!validation) {
      return res
        .status(401)
        .json({ message: "request has not been valoidate!!!" });
    }
    res.status(200).json({ message: "request has been update successfully " });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd updated restaurant!!!" });
  }
};

const fetchRestaurants = async (req, res) => {
  try {
    /*let creator = await RestaurantServices.getUserAuthor(
      req.body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }*/

    let restaurants = await RestaurantServices.findRestaurants();
    if (restaurants) {
      res.status(200).json(restaurants);
    } else {
      res.status(401).json({ message: "restaurant has been not fetch" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd fetch restaurant!!!" });
  }
};

const fetchOneRestaurant = async (req, res) => {
  try {
    let restaurant = await RestaurantServices.findRestaurant({
      _id: req.params?.id,
    });
    if (restaurant) {
      res.status(200).json(restaurant);
    } else {
      res.status(401).json({ message: "restaurant has been not fetch" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd fetch restaurant!!!" });
  }
};

const requestMaterial = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    console.log("##########***********")
    //console.log(body)
    // let restaurant = await RestaurantServices.findRestaurant({
    //   _id: body.restaurantId,
    // });
    // if (!restaurant) {
    //   console.log("restaurant has been not fetch");
    //   return res.status(401).json({ "message": "restaurant has been not fetch" });
    // }
    const laboratory = await api_consumer.getLaboratoryById(
      body.laboratoryId, req.token
    );
    // console.log("LE LABO")
    // console.log(laboratory);
    if (!laboratory?.data) {

       console.log("laboratory has been not fetch");
      return res.status(401).json({ message: "laboratory has been not fetch" });
    }

    const material = await api_consumer.getMaterialById(
      body.materialId,
      req.token
    );
    if (!material?.data) {
      console.log("material has been not fetch");
      return res.status(401).json({ message: "material has been not fetch" });
    }
    
    const laboratoryBody = {
      id: laboratory.data._id,
      labo_name: laboratory.data.labo_name,
      adress: laboratory.data.adress,
      image: laboratory.data.image,
      email: laboratory.data.email
    }
    
    const requestBody = {
      material: material.data,
      laboratory: laboratoryBody,
      qte: body.qte,
      date_providing: Date.now(),
      restaurantId: body.restaurantId,
    };
    // console.log("************requestBody********************************");
    // console.log(requestBody);
    // console.log("************requestBody********************************");
    const restaurant = await RestaurantServices.findRestaurant({
      _id: body.restaurantId,
    });
    
    if (!restaurant) {
      console.log("restaurant has been not fetch");
      return res.status(401).json({ message: "material has been not fetch" });
    }
    const restaurantInfo = {
      _id: restaurant._id,
      restaurant_name: restaurant.restaurant_name,
      infos: restaurant.infos
    };
    
    const requesting = await RestaurantServices.requestMaterialById(requestBody)
    if (!requesting) {
       console.log("Request Not saved");
       return res
         .status(401)
         .json({ message: "Request Not saved" });
    }
    const theLast = requesting.providings.slice(-1)
    // console.log(theLast)
    // console.log("**************ID: ");
    // console.log(theLast[0]?._id);
    // console.log("**************: ");
    // console.log(theLast?.qte);
    const requestMaterial = {
      requestId: theLast[0]?._id,
      material: material.data,
      restaurant: restaurantInfo,
      qte: body.qte,
      date_providing: Date.now(),
      validated: false,
      date_validated: null,
    };
    const laboratoryUpdated = await api_consumer.addRequestingById(
      body.laboratoryId,
      requestMaterial
    );
    res.status(200).json({ message: "Request done well!!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd fetch restaurant!!!" });
  }
};

// get Clients  in database
/*const fetchClients = async (req, res) => {
  try {
    let creator = await RestaurantServices.getUserAuthor(
      req.body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    let clients = await RestaurantServices.getClients(
      req.params?.id,
      req.token
    );
    res.status(200).json(clients);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};*/

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
  fetchRestaurants,
  fetchOneRestaurant,
  requestMaterial,
  validateRequest,
  //fetchClients,
};
