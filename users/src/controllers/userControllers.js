const cryptoJS = require("crypto-js");
const userService = require("../services/userServices");
const roles = require("../models/roles");
const { fieldsRequired } = require("../models/user/users");
const print = require("../log/print");

//Create user in Data Base
const createUser = async (req, res) => {
  try {
    let body = JSON.parse(req.headers?.body);
    // check if user already exits
    let user = await userService.findUser({ email: body?.email });

    if (user) {
      return res.status(401).json({ message: "User already exists!!!" });
    }

    // fetch user creator inside of database
    let creator = await userService.findUser({
      _id: body?._creator,
    });

    if (!creator) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot create user because you don't have an authorization!!!",
      });
    }

    if (body?.restaurant) {
      // fetch restaurant since microservice restaurant
      let restaurant = await userService.getRestaurant(
        body?.restaurant,
        req.token
      );
      if (restaurant?._id) {
        body["restaurant"] = restaurant;
      }
    }
    // set password encrypt

    body["password"] = cryptoJS.AES.encrypt(
      body?.password,
      process.env.PASS_SEC
    ).toString();

    // set username
    body["username"] = [body?.firstName, body?.lastName].join(" ");

    // set creator
    body["_creator"] = creator;

    // set user avatar
    body["avatar"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";

    print({ newUser: body, creator: creator?._id }, "*");
    // save new user in database
    let newuser = await userService.createUser(body);

    if (newuser?._id) {
      res
        .status(200)
        .json({ message: "User has been created successfully!!!" });
    } else {
      res
        .status(401)
        .json({ message: "User bas been not created successfully!!!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd creating user!!!" });
  }
};

// Update user in database
const UpdateUser = async (req, res) => {
  try {
    let body = JSON.parse(req.headers?.body);
    // get author that update current user
    let creator = await userService.findUser({
      _id: body._creator,
    });

    if (!creator?._id) {
      return res
        .status(401)
        .json({ message: "you must authenticated to update current user!!!" });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot update user because you don't have an authorization,please see your administrator!!!",
      });
    }

    // find user that author want to update
    let user = await userService.findUser({ _id: req.params?.id });

    if (!user?._id) {
      return res
        .status(401)
        .json({ message: "unable to update user beacuse it not exists!!!" });
    }

    // fetch restaurant if exists in body request object since microservice restaurant

    if (body?.restaurant) {
      let restaurant = await userService.getRestaurant(
        body?.restaurant,
        req.token
      );

      print({ restaurant });

      if (!restaurant?._id) {
        throw new Error("invalid data send");
      }

      // update some fields in body request (restaurant and creator field)
      body["restaurant"] = restaurant;
    }

    // set user that make update in database
    body["_creator"] = creator;

    // get valid keys
    let keysvalided = Object.keys(fieldsRequired);
    // update all valid fields before save it in database
    for (let key in body) {
      if (keysvalided.includes(key)) {
        user[key] = body[key];
      }
    }

    // update user in database
    let userUpdated = await user.save();

    if (userUpdated?._id) {
      res
        .status(200)
        .json({ message: "User has been updated successfully!!!" });
    } else {
      res.status(401).json({
        message: "User has been not updated successfully!!",
      });
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Error occured during delete request!!" });
  }
};

//Delete user in database
const deleteUser = async (req, res) => {
  try {
    let body = JSON.parse(req.headers?.body);
    let creator = await userService.findUser({
      _id: body?._creator,
    });

    if (!creator) {
      return res
        .status(401)
        .json({ message: "you must authenticated to delete current user!!!" });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot delete user because you don't have an authorization,please see your administrator!!!",
      });
    }

    //behind, mongoose find and delete user if exists
    let userDeleted = await userService.deleteUser(
      { _id: req.params?.id, deletedAt: null },
      { _creator: creator } // the current user who do this action
    ); // if user exists in database, user must be not null otherwise user must be null

    if (!userDeleted) {
      return res.status(401).json({
        message:
          "unable to delete User because he not exists or already deleted in database!!!",
      });
    }

    if (userDeleted?.deletedAt) {
      print({ userDeleted });
      return res
        .status(200)
        .json({ message: "User has been delete successfully!!!" });
    } else {
      return res
        .status(401)
        .json({ message: "User has been not delete successfully!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occured during delete request!!" });
  }
};

// fetch one user in database
const fetchUser = async (req, res) => {
  try {
    let user = await userService.findUser({ _id: req.params?.id });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during fetch action" });
  }
};

// fetch all users in database

const fetchUsers = async (req, res) => {
  try {
    let users = await userService.findUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occured during fetch action" });
  }
};

// fetch all users in specific restaurant
const fetchUsersInRestaurant = async (req, res) => {
  try {
    let users = await userService.findUsers({
      "restaurant._id": req.params?.id,
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during fetch action" });
  }
};

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  createUser,
  deleteUser,
  UpdateUser,
  fetchUsers,
  fetchUser,
  fetchUsersInRestaurant,
};
