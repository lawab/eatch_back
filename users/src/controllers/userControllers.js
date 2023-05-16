const cryptoJS = require("crypto-js");
const userService = require("../services/userServices");
const roleService = require("../services/roleServices");

const roles = require("../models/roles");
const { fieldsRequired } = require("../models/user/users");
const { fieldsRequired: fieldsRoleRequired } = require("../models/role/role");

const print = require("../log/print");
const { fieldsValidator } = require("../models/validators");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");

//Create user in Data Base
const createUser = async (req, res) => {
  try {
    let body = req.body;

    // check if user already exits
    let user = await userService.findUser({ email: body?.email });
    console.log({ user, email: body?.email });
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
      // add new user create in historical
      let response = await addElementToHistorical(
        async () => {
          let addResponse = await userService.addUserToHistorical(
            creator?._id,
            {
              users: {
                _id: newuser?._id,
                action: "CREATED",
              },
            },
            req.token
          );

          return addResponse;
        },
        async () => {
          let elementDeleted = await userService.deleteTrustlyUser({
            _id: newuser?._id,
          });
          return elementDeleted;
        }
      );

      return closeRequest(
        response,
        res,
        "User has been created successfully!!!",
        "User has  been not creadted successfully,please try again later,thanks!!!"
      );
    } else {
      res
        .status(401)
        .json({ message: "User has been not created successfully!!!" });
    }
  } catch (err) {
    print({ error: err.message }, "x");

    res.status(500).json({ message: "Error encounterd creating user!!!" });
  }
};

//Create new role of user in Data Base
const createUserRole = async (req, res) => {
  try {
    let body = req.body;

    // verify fields on body
    let { validate } = fieldsValidator(Object.keys(body), fieldsRoleRequired);

    // if body have invalid fields
    if (!validate) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    // fetch creator inside of database
    let creator = await userService.findUser({ _id: body?._creator });

    if (!creator) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot create role because you don't have an authorization!!!",
      });
    }

    let role = await roleService.findRole({
      value: body?.value,
    });

    if (role) {
      return res.status(401).json({
        message:
          "your cannot duplicate role it already exists,please take another role name",
      });
    }

    // save new role in database
    let newRole = await roleService.createRole(body);
    print({ newRole });
    if (newRole?._id) {
      res
        .status(200)
        .json({ message: "role has been created successfully!!!" });
    } else {
      res
        .status(401)
        .json({ message: "role bas been not created successfully!!!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd creating role!!!" });
  }
};

//update user role in Data Base
const UpdateRole = async (req, res) => {
  try {
    let body = req.body;
    const message = "invalid data!!!";

    // verify fields on body
    let { validate } = fieldsValidator(Object.keys(body), fieldsRoleRequired);

    // fetch role creator inside of database
    let creator = await userService.findUser({ _id: body?._creator });

    // if body have invalid fields
    if (!validate) {
      return res.status(401).json({ message });
    }

    if (!creator) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot create role because you don't have an authorization!!!",
      });
    }

    // find and update role in database
    let newRole = await roleService.updateRole(
      {
        _id: req.params?.id,
      },
      {
        ...body,
      }
    );
    print({ newRole });

    if (newRole?._id) {
      res
        .status(200)
        .json({ message: "role has been updated successfully!!!" });
    } else {
      res.status(401).json({ message: "role not exists!!!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd creating role!!!" });
  }
};

// Update user in database
const UpdateUser = async (req, res) => {
  try {
    let body = req.body;

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

    /* copy values and fields from user found in database before updated it. 
       it will use to restore user updated if connection with historical failed
    */
    let bodyCopy = Object.assign({}, user._doc);

    print({ userCopy: bodyCopy });

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
    body["_creator"] = creator?._id;

    // get valid keys
    let keysvalided = Object.keys(fieldsRequired);

    // update all valid fields before save it in database
    for (let key in body) {
      if (keysvalided.includes(key)) {
        user[key] = body[key];
      }
    }

    // update avatar if exists
    user["avatar"] = req.file ? "/datas/" + req.file?.filename : user["avatar"];

    // update user in database
    let userUpdated = await user.save();

    print({ userUpdated });

    if (userUpdated?._id) {
      // add new user create in historical
      let response = await addElementToHistorical(
        async () => {
          let response = await userService.addUserToHistorical(
            creator?._id,
            {
              users: {
                _id: userUpdated?._id,
                action: "UPDATED",
              },
            },
            req.token
          );

          return response;
        },
        async () => {
          for (const field in bodyCopy) {
            if (Object.hasOwnProperty.call(bodyCopy, field)) {
              userUpdated[field] = bodyCopy[field];
            }
          }
          let userRestored = await userUpdated.save({ timestamps: false }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ userRestored });
          return userRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "User has been updated successfully!!!",
        "User has not been Updated successfully,please try again later,thanks!!!"
      );
    } else {
      res.status(401).json({
        message: "User has been not updated successfully!!",
      });
    }
  } catch (error) {
    print({ error: error }, "x");
    // if error occured,remove user created if exists in database
    res.status(500).json({ message: "Error occured during delete request!!" });
  }
};

//Delete user in database
const deleteUser = async (req, res) => {
  try {
    let body = req.body;

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

    // find user that author want to update
    let user = await userService.findUser({
      _id: req.params?.id,
      deletedAt: null,
    });

    if (!user?._id) {
      return res.status(401).json({
        message:
          "unable to delete User because he not exists or already deleted in database!!!",
      });
    }

    /* copy values and fields from user found in database before updated it. 
       it will use to restore user updated if connection with historical failed
      */
    let userCopy = Object.assign({}, user._doc);

    print({ userCopy });

    //update deleteAt and cretor fields from user

    user.deletedAt = Date.now(); // set date of deletion
    user._creator = creator?._id; // the current user who do this action

    let userDeleted = await user.save();

    console.log({ userDeleted });

    if (userDeleted?.deletedAt) {
      // add new user create in historical
      let response = await addElementToHistorical(
        async () => {
          let response = await userService.addUserToHistorical(
            creator?._id,
            {
              users: {
                _id: userDeleted?._id,
                action: "DELETED",
              },
            },
            req.token
          );

          return response;
        },
        async () => {
          for (const field in userCopy) {
            if (Object.hasOwnProperty.call(userCopy, field)) {
              userDeleted[field] = userCopy[field];
            }
          }
          let userRestored = await userDeleted.save({ timestamps: false }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ userRestored });
          return userRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "User has been delete successfully!!!",
        "User has not been deleete successfully,please try again later,thanks!!!"
      );
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

const deleteRole = async (req, res) => {
  try {
    let body = req.body;
    let creator = await userService.findUser({
      _id: body?._creator,
    });

    if (!creator) {
      return res.status(401).json({
        message: "you must authenticated to delete current role!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot delete role because you don't have an authorization,please see your administrator!!!",
      });
    }

    //behind, mongoose find and delete role if exists
    let roleDeleted = await roleService.deleteRole(
      { _id: req.params?.id, deletedAt: null },
      { _creator: creator } // the current user who do this action
    ); // if role exists in database, role must be not null otherwise role must be null

    if (!roleDeleted) {
      return res.status(401).json({
        message:
          "unable to delete role because it not exists or already deleted in database!!!",
      });
    }

    if (roleDeleted?.deletedAt) {
      print({ roleDeleted });
      return res
        .status(200)
        .json({ message: "role has been delete successfully!!!" });
    } else {
      return res
        .status(401)
        .json({ message: "role has been not delete successfully!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occured during delete request!!" });
  }
};

// fetch one employerType in database
const fetchOneRole = async (req, res) => {
  try {
    let role = await roleService.findRole({
      _id: req.params?.id,
    });
    return res.status(200).json(role);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during fetch action" });
  }
};

// fetch one employerType in database
const fetchAllRoles = async (req, res) => {
  try {
    let roles = await roleService.findRoles();
    return res.status(200).json(roles);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during fetch action" });
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
const disconnectUser = async (req, res) => {
  let userUpdated = await userService.UpdateUser(
    {
      _id: req.params?.id,
    },
    {
      isOnline: false,
    }
  );

  if (!userUpdated) {
    return res.status(401).json({
      message: "unable to disconnect user because it not exists",
    });
  }

  print({ userUpdated });

  if (!userUpdated?.isOnline) {
    return res.status(200).json({
      message: "User disconnected successfully",
    });
  } else {
    return res.status(401).json({
      message: "User has not be disconnected successfully!!!",
    });
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
  createUserRole,
  UpdateRole,
  deleteRole,
  fetchAllRoles,
  fetchOneRole,
  disconnectUser,
};
