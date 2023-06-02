const RestaurantServices = require("../services/RestaurantServices");
const roles = require("../models/roles");
const { default: mongoose } = require("mongoose");
const UpdateForeignFields = require("../controllers/UpdateForeignFields");
//Create restaurant in Data Base
const createRestaurant = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    let info = {
      town: body?.town,
      address: body?.address,
      logo: req.file ? "/datas/" + req.file.filename : "/datas/avatar.png",
    };
    let restaurantBody = {
      restaurant_name: body?.restaurant_name,
      info: info,
      _creator: body?._creator,
    };

    let restaurant = await RestaurantServices.createRestaurant(restaurantBody);
    if (restaurant) {
      res
        .status(200)
        .json({ message: "restaurant has been created successfully " });
    } else {
      res.status(500).json({ message: "restaurant has been not created" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: "Error encounterd creating restaurant!!!" });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
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

    let restaurant = await RestaurantServices.deleRestaurant(restaurantBody);
    if (restaurant) {
      res
        .status(200)
        .json({ message: "restaurant has been deleted successfully " });
    } else {
      res.status(500).json({ message: "restaurant has been not deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error encounterd delete restaurant!!!" });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    let info = {
      town: body?.town,
      address: body?.address,
      logo: req.file ? "/datas/" + req.file.filename : "/datas/avatar.png",
    };
    let restaurantBody = {
      restaurant_name: body?.restaurant_name,
      info: info,
      _creator: body?._creator,
    };

    const id = req.params.id;

    let restaurant = await RestaurantServices.updateRestaurant(
      id,
      restaurantBody
    );
    if (restaurant) {
      res
        .status(200)
        .json({ message: "restaurant has been update successfully " });
    } else {
      res.status(500).json({ message: "restaurant has been not updated" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error encounterd updated restaurant!!!" });
  }
};

const fetchRestaurants = async (req, res) => {
  try {
    let restaurant = await RestaurantServices.findRestaurants();
    if (restaurant) {
      res.status(200).json(restaurant);
    } else {
      res.status(500).json({ message: "restaurant has been not fetch" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error encounterd fetch restaurant!!!" });
  }
};

const fetchOneRestaurant = async (req, res) => {
  try {
    let restaurant = await RestaurantServices.findRestaurant();
    if (restaurant) {
      res.status(200).json(restaurant);
    } else {
      res.status(500).json({ message: "restaurant has been not fetch" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error encounterd fetch restaurant!!!" });
  }
};

// get Clients  in database
const fetchClients = async (req, res) => {
  try {
    let Client = await RestaurantServices.getClients(req.params?.id, req.token);
    res.status(200).json(Client);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "Error occured during get request!!!" });
  }
};

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
  fetchRestaurants,
  fetchOneRestaurant,
  fetchClients,
};
