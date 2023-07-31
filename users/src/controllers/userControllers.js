const userService = require("../services/userServices");
const roleService = require("../services/roleServices");
const roles = require("../models/roles");
const { fieldsRequired: fieldsRoleRequired } = require("../models/role/role");
const { fieldsValidator } = require("../models/validators");
const { addElementToHistorical } = require("../services/historicalFunctions");
const setUserValues = require("../methods/setUserValues");
const updateUserValues = require("../methods/updateUserValues");

//Create user in Data Base
const createUser = async (req, res) => {
  let newuser = null;
  try {
    // let body = req.body;
    let body = JSON.parse(req.headers?.body);
    console.log({ body });
    // check if user already exits
    let user = await userService.findUser({ email: body?.email });

    if (user) {
      return res.status(401).json({ message: "User already exists!!!" });
    }

    // set values required
    let bodyUpdate = await setUserValues(body, req, req.token);

    // save new user in database
    console.log("console.log(bodyUpdate)***********");
    console.log(bodyUpdate)
    newuser = await userService.createUser(bodyUpdate);

    if (newuser) {
    //   // add new user create in historical
    //   let response = await addElementToHistorical(
    //     async () => {
    //       return await userService.addToHistorical(
    //         newuser._creator._id,
    //         {
    //           users: {
    //             _id: newuser._id,
    //             action: "CREATED",
    //           },
    //         },
    //         req.token
    //       );
    //     },
    //     async () => {
    //       let elementDeleted = await userService.deleteTrustlyUser({
    //         _id: newuser._id,
    //       });
    //       console.log({ elementDeleted });
    //     }
    //   );

    //   if (response?.status === 200) {
    //     console.log({ response: response.data?.message });
    //     return res
    //       .status(200)
    //       .json({ message: "User has been created successfully!!!" });
    //   } else {
    //     return res.status(401).json({
    //       message: "Created User failed,please try again!!!",
    //     });
    //   }
    // } else {
    //   res
    //     .status(401)
    //     .json({ message: "Created User failed,please try again!!!" });
      res.status(200).json({"message" : "User created successfully!!!"})
    }
  } catch (err) {
    console.log({ err });
    // if (newuser) {
    //   let elementDeleted = await userService.deleteTrustlyUser({
    //     _id: newuser._id,
    //   });
    //   console.log({ elementDeleted });
    // }
    res
      .status(500)
      .json({ message: "Error occured during creation of user!!!" });
  }
};

//Create new role of user in Data Base
const createUserRole = async (req, res) => {
  try {
    // let body = req.body;
    let body = JSON.parse(req.headers?.body);
    console.log({ body });
    // fetch creator inside of database
    let creator = await userService.findUser({ _id: body?._creator });

    if (!creator) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    // fetch creator inside of database
    let restaurant = await userService.getRestaurant(
      body?.restaurant,
      req.token
    );

    if (!restaurant) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    body["restaurant"] = restaurant;

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
    console.log({ newRole });
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
    console.log({ newRole });

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
  let bodyCopy = null;
  let userUpdated = null;

  try {
    let body = JSON.parse(req.headers?.body);
    // let body = req.body;

    let bodyUpdate = await updateUserValues(body, req);

    // find user in database
    let user = await userService.findUser({ _id: req.params?.id });

    if (!user?._id) {
      return res
        .status(401)
        .json({ message: "unable to update user beacuse it not exists!!!" });
    }

    /* make copy fromoriginal user */
    bodyCopy = Object.assign({}, user._doc);

    // update all valid fields before save it in database
    for (let key in bodyUpdate) {
      user[key] = bodyUpdate[key];
    }

    // update user in database
    userUpdated = await user.save();

    console.log({ userUpdated });

    if (userUpdated) {
      // add new user create in historical
    //   let response = await addElementToHistorical(
    //     async () => {
    //       return await userService.addToHistorical(
    //         userUpdated._creator._id,
    //         {
    //           users: {
    //             _id: userUpdated._id,
    //             action: "UPDATED",
    //           },
    //         },
    //         req.token
    //       );
    //     },
    //     async () => {
    //       for (const field in bodyCopy) {
    //         if (Object.hasOwnProperty.call(bodyCopy, field)) {
    //           userUpdated[field] = bodyCopy[field];
    //         }
    //       }

    //       // restore Object in database,not update timestamps because it is restoration from olds values fields in database
    //       let userRestored = await userUpdated.save({ timestamps: false });
    //       console.log({ userRestored });
    //       return userRestored;
    //     }
    //   );

    //   if (response?.status === 200) {
    //     console.log({ response: response.data?.message });
    //     return res
    //       .status(200)
    //       .json({ message: "User has been updated successfully!!!" });
    //   } else {
    //     return res.status(401).json({
    //       message: "Update user failed,please try again!!!",
    //     });
    //   }
    // } else {
    //   res.status(401).json({
    //     message: "Update user failed,please try again!!!",
    //   });
      res.status(200).json({"message" : "User updated successfully!!!"})
    }
  } catch (error) {
    // if (userUpdated && bodyCopy) {
    //   for (const field in bodyCopy) {
    //     if (Object.hasOwnProperty.call(bodyCopy, field)) {
    //       userUpdated[field] = bodyCopy[field];
    //     }
    //   }
      // restore Object in database,not update timestamps because it is restoration from olds values fields in database
      // let userRestored = await userUpdated.save({ timestamps: false });
      // console.log({ userRestored });
    
    console.log({ error }, "x");
    // if error occured,remove user created if exists in database
    res.status(500).json({ message: "Error occured during delete request!!" });
  }
};

//Delete user in database
const deleteUser = async (req, res) => {
  let userCopy = null;
  let userDeleted = null;
  try {
    let body = JSON.parse(req.headers?.body);

    // const body = req.body;

    let creator = await userService.findUser({
      _id: body?._creator,
    });

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
      return res.status(401).json({
        message:
          "you must authenticated and has authorization ro delete current user!!",
      });
    }

    // find user that author want to update
    let user = await userService.findUser({
      _id: req.params?.id,
      deletedAt: null,
    });

    if (!user) {
      return res.status(401).json({
        message:
          "unable to delete User because he not exists or already deleted in database!!!",
      });
    }

    /* copy values and fields from user found in database before updated it. 
       it will use to restore user updated if connection with historical failed
      */
    userCopy = Object.assign({}, user._doc);

    //update deleteAt and cretor fields from user

    user.deletedAt = Date.now();
    user._creator = creator._id;

    let userDeleted = await user.save();

    console.log({ userDeleted });

    if (userDeleted?.deletedAt) {
      // add new user create in historical
    //   let response = await addElementToHistorical(
    //     async () => {
    //       let response = await userService.addToHistorical(
    //         userDeleted._creator._id,
    //         {
    //           users: {
    //             _id: userDeleted?._id,
    //             action: "DELETED",
    //           },
    //         },
    //         req.token
    //       );

    //       return response;
    //     },
    //     async () => {
    //       // restore only fields would had changed in database
    //       userDeleted["deletedAt"] = userCopy["deletedAt"];
    //       userDeleted["updatedAt"] = userCopy["updatedAt"];
    //       userDeleted["createdAt"] = userCopy["createdAt"];

    //       // restore Object in database,not update timestamps because it is restoration from olds values fields in database
    //       let userRestored = await userDeleted.save({ timestamps: false });
    //       console.log({ userRestored });
    //       return userRestored;
    //     }
    //   );

    //   if (response?.status === 200) {
    //     console.log({ response: response.data?.message });
    //     return res
    //       .status(200)
    //       .json({ message: "User has been delete successfully!!!" });
    //   } else {
    //     return res.status(401).json({
    //       message: "Delete user failed,please try again",
    //     });
    //   }
    // } else {
    //   return res
    //     .status(401)
    //     .json({ message: "Delete user failed,please try again" });
    res.status(200).json({"massage" : "User deleted successfully!!!"})
    }
  } catch (error) {
    // if (userDeleted && userCopy) {
    //   // restore only fields would had changed in database
    //   userDeleted["deletedAt"] = userCopy["deletedAt"];
    //   userDeleted["updatedAt"] = userCopy["updatedAt"];
    //   userDeleted["createdAt"] = userCopy["createdAt"];

    //   // restore Object in database,not update timestamps because it is restoration from olds values fields in database
    //   let userRestored = await userDeleted.save({ timestamps: false });
    //   console.log({ userRestored });
    //   return userRestored;
    // }
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
      console.log({ roleDeleted });
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

  console.log({ userUpdated });

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
