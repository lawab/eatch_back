const { fieldsRequired } = require("../models/Client");
const { fieldsValidator } = require("../models/validators");
const roles = require("../models/roles");
const ClientServices = require("../services/ClientServices");
const { default: mongoose } = require("mongoose");
const updateForeignFields = require("../controllers/updateForeignField");

//Create Client in Data Base
const createClient = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    let fields = Object.keys(body);

    // fill data before store it in database
    let data = {};
    fields.forEach((f) => {
      data[f] = body[f];
    });

    // get client user
    let client = await ClientServices.findClient({ email: data?.email });

    //if client already exists
    if (client?._id) {
      return res.status(401).json({ message: "user already exists !!!" });
    }
    let restaurant = await ClientServices.getRestaurant(data?.restaurant_id);
    data.restaurant = restaurant;
    let clientCreated = await ClientServices.createClient(data);

    console.log("###########################");
    console.log({ createClient: clientCreated?._id });
    console.log("###########################");

    if (clientCreated?._id) {
      return res
        .status(200)
        .json({ message: " user created successefully!!!" });
    } else {
      return res.status(401).json({ message: "user is not created !!!" });
    }
    /*} else {
      res.status(401).json({ message: "invalid data!!!" });*/
    //}
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occured during a creation of client!!!" });
  }
};
const deleteClient = async (req, res) => {
  try {
    let deleteClient = await ClientServices.deleteOne(
      {
        _id: req.params?.id,
        deletedAt: null,
      },
      { _creator: req.body._creator, deletedAt: Date.now() }
    );

    // if Client not exits or had already deleted
    if (!deleteClient) {
      return res
        .status(401)
        .json({ message: " the client is not exists or already deleted" });
    }
    // Client exits and had deleted successfully
    if (deleteClient.deletedAt) {
      console.log({ deleteClient: deleteClient._id });
      return res
        .status(200)
        .json({ message: "Client has been delete sucessfully" });
    }

    let Client = await ClientServices.deleClient(ClientBody);
    if (Client) {
      res
        .status(200)
        .json({ message: "Client has been deleted successfully " });
    } else {
      res.status(500).json({ message: "Client has been not deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error encounterd delete Client!!!" });
  }
};

const updateClient = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    let ClientBody = {
      commandes: body?.ClientCommande,
      firstname: body?.firstname,
      id_client: body?.id_client,
      id_Client: body?.id_Client,
      is_auth: body?.is_auth,
      lastname: body?.lastname,
      phone_number: body?.phone_number,
      products_liked: body?.products_liked,
      _creator: body?._creator,
    };
    const id = req.params.id;

    let Client = await ClientServices.updateClient(id, ClientBody);
    console.log(Client);
    if (Client) {
      res.status(200).json({ message: "Client has been update successfully " });
    } else {
      res.status(401).json({ message: "Client has been not updated" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error encounterd updated Client!!!" });
  }
};

// get one Client in database
const fetchClient = async (req, res) => {
  try {
    let Client = await ClientServices.findOneClient({
      _id: req.params?.id,
    });
    if (Client?._id) {
      res.status(200).json(Client);
    } else {
      res.status(401).json({ message: "Client not found!!!" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "Error occured during get request!!!" });
  }
};
// get Clients  in database
const fetchClients = async (req, res) => {
  try {
    let Client = await ClientServices.findClients();
    res.status(200).json(Client);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "Error occured during get request!!!" });
  }
};

// fetch clients by restaurant in database
const fetchClientByRestaurant = async (req, res) => {
  try {
    let Client = await ClientServices.findClients({
      "restaurant._id": req.params?.id,
    });
    res.status(200).json(Client);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "Error occured during get request!!!" });
  }
};

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  createClient,
  deleteClient,
  updateClient,
  fetchClient,
  fetchClients,
  fetchClientByRestaurant,
};
