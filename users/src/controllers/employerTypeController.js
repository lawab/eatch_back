const employerServices = require("../services/employerServices");
const userServices = require("../services/userServices");

const roles = require("../models/roles");
const { fieldsValidator } = require("../models/validators");
const { fieldsRequired } = require("../models/employertype/employerType");

//Create employerType in Data Base
const createEmployerType = async (req, res) => {
  try {
    let body = req.body;
    const message = "invalid data!!!";

    // verify fields on body
    let { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

    // if body have invalid fields
    if (!validate) {
      return res.status(401).json({ message });
    }

    // fetch employerType creator inside of database
    let creator = await userServices.findUser({ _id: req.body?._creator });

    if (!creator) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot create EmployerType because you don't have an authorization!!!",
      });
    }

    let employertype = await employerServices.findEmployerType({
      fonction: req.body?.fonction,
    });

    if (employertype) {
      return res.status(401).json({
        message:
          "your cannot duplicate EmployerType it already exists,please take another employerType",
      });
    }

    // save new employerType in database
    let newEmployerType = await employerServices.createEmployerType(body);
    console.log({ newEmployerType });
    if (newEmployerType?._id) {
      res
        .status(200)
        .json({ message: "EmployerType has been created successfully!!!" });
    } else {
      res
        .status(401)
        .json({ message: "EmployerType bas been not created successfully!!!" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error encounterd creating employerType!!!" });
  }
};

//Create employerType in Data Base
const UpdateEmployerType = async (req, res) => {
  try {
    let body = req.body;
    const message = "invalid data!!!";

    // verify fields on body
    let { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

    // fetch employerType creator inside of database
    let creator = await userServices.findUser({ _id: req.body?._creator });

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
          "your cannot create EmployerType because you don't have an authorization!!!",
      });
    }

    // find and update employerType in database
    let newEmployerType = await employerServices.updateEmployerType(
      {
        _id: req.params?.id,
      },
      {
        ...body,
      }
    );
    console.log({ newEmployerType });

    if (newEmployerType?._id) {
      res
        .status(200)
        .json({ message: "EmployerType has been updated successfully!!!" });
    } else {
      res.status(401).json({ message: "EmployerType not exists!!!" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error occured during updating employerType!!!" });
  }
};

const deleteEmployerType = async (req, res) => {
  try {
    let body = req.body;
    let creator = await userServices.findUser({
      _id: body?._creator,
    });

    if (!creator) {
      return res.status(401).json({
        message: "you must authenticated to delete current employerType!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot delete employerType because you don't have an authorization,please see your administrator!!!",
      });
    }

    //behind, mongoose find and delete employerType if exists
    let employerTypeDeleted = await employerServices.deleteEmployerType(
      { _id: req.params?.id, deletedAt: null },
      { _creator: creator } // the current user who do this action
    ); // if employerType exists in database, employerType must be not null otherwise employerType must be null

    if (!employerTypeDeleted) {
      return res.status(401).json({
        message:
          "unable to delete employerType because it not exists or already deleted in database!!!",
      });
    }

    if (employerTypeDeleted?.deletedAt) {
      console.log({ employerTypeDeleted });
      return res
        .status(200)
        .json({ message: "employerType has been delete successfully!!!" });
    } else {
      return res
        .status(401)
        .json({ message: "employerType has been not delete successfully!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occured during delete request!!" });
  }
};
// fetch one employerType in database
const fetchEmployerType = async (req, res) => {
  try {
    let employerType = await employerServices.findEmployerType({
      _id: req.params?.id,
    });
    return res.status(200).json(employerType);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during fetch action" });
  }
};

const fetchAllEmployerType = async (_, res) => {
  try {
    let employerTypes = await employerServices.findEmployerTypes();
    return res.status(200).json(employerTypes);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during fetch action" });
  }
};
//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  createEmployerType,
  UpdateEmployerType,
  deleteEmployerType,
  fetchEmployerType,
  fetchAllEmployerType,
};
