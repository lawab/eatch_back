const cryptoJS = require("crypto-js");
const { fieldsRequired } = require("../models/Client");
const { fieldsValidator } = require("../models/validators");
const roles = require("../models/roles");
const ClientServices = require("../services/ClientServices");
const { default: mongoose } = require("mongoose");
const updateForeignField = require("../controllers/updateForeignField");

//Create Client in Data Base
const createClient = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    //let body = req.body;
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

    let restaurant = await ClientServices.getRestaurant(
      data?.restaurant,
      req.token
    );
    data["restaurant"] = restaurant;

    // set password encrypt

    (data["password"] = cryptoJS.AES.encrypt(
      data.password,
      process.env.PASS_SEC
    ).toString()),
      // set clientname
      (data["username"] = [data.firstname, data.lastname].join(" "));

    // set creator
    // body["_creator"] = creator;

    // set user avatar
    data["avatar"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";

    console.log("###########################");

    console.log("###########################");
    let clientCreated = await ClientServices.createClient(data);
    console.log({ createClient: clientCreated?._id });
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
    /*let creator = await ClientServices.getclientAuthor(
      req.body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });*/

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

    /*let Client = await ClientServices.deleClient(ClientBody);
    if (Client) {
      res
        .status(200)
        .json({ message: "Client has been deleted successfully " });
    } else {
      res.status(500).json({ message: "Client has been not deleted" });
    }*/
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd delete Client!!!" });
  }
};

const updateClient = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    //let body = req.body;
    const id = req.params.id;
    console.log("*************************************");
    console.log(body);
    let restaurant = await ClientServices.getRestaurant(
      body?.restaurant,
      req.token
    );
    body["restaurant"] = restaurant;
    console.log("*************************************");
    console.log(body);
    let client = await ClientServices.updateClient(id, body);
    console.log(client);
    if (client) {
      res.status(200).json({ message: "Client has been update successfully " });
    } else {
      res.status(401).json({ message: "Client has been not updated" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd updated Client!!!" });
  }
};

// get one Client in database
const fetchClient = async (req, res) => {
  try {
    let client = await ClientServices.findOneClient({
      _id: req.params?.id,
    });
    if (client?._id) {
      res.status(200).json(client);
    } else {
      res.status(401).json({ message: "Client not found!!!" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};
// get Clients  in database
const fetchClients = async (req, res) => {
  try {
    let clients = await ClientServices.findClients();
    if (clients) {
      res.status(200).json(clients);
    } else {
      res.status(401).json({ message: "Client has been not fetch" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch clients by restaurant in database
const fetchClientByRestaurant = async (req, res) => {
  try {
    let clients = await ClientServices.findClients({
      "restaurant._id": req.params?.id,
    });
    res.status(200).json(clients);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

const disconnectClient = async (req, res) => {
  console.log(req.params);
  let clientUpdated = await ClientServices.updateClient(
    {
      _id: req.params?.id,
    },
    {
      isOnline: false,
    }
  );

  if (!clientUpdated) {
    return res.status(401).json({
      message: "unable to disconnect user because it not exists",
    });
  }

  console.log({ clientUpdated });

  if (!clientUpdated?.isOnline) {
    return res.status(200).json({
      message: "client disconnected successfully",
    });
  } else {
    return res.status(401).json({
      message: "client has not be disconnected successfully!!!",
    });
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
  disconnectClient,
};
