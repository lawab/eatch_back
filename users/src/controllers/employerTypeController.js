const employerServices = require("../services/employerServices");
const userServices = require("../services/userServices");

const print = require("../log/print");
const roles = require("../models/roles");
const { fieldsValidator } = require("../models/validators");
const { fieldsRequired } = require("../models/employertype/employerType");

//Create user in Data Base
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

    // fetch user creator inside of database
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

    // save new user in database
    let newEmployerType = await employerServices.createEmployerType(body);

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
    res.status(500).json({ message: "Error encounterd creating user!!!" });
  }
};

//Create user in Data Base
const UpdateEmployerType = async (req, res) => {
  try {
    let body = req.body;
    const message = "invalid data!!!";

    // verify fields on body
    let { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

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

    // fetch user creator inside of database
    let newEmployerType = await userServices.UpdateEmployerType(
      {
        _id: req.params?._id,
      },
      {
        ...body,
      }
    );

    if (newEmployerType?._id) {
      res
        .status(200)
        .json({ message: "EmployerType has been updated successfully!!!" });
    } else {
      res.status(401).json({ message: "EmployerType not exists!!!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd creating user!!!" });
  }
};

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  createEmployerType,
  UpdateEmployerType,
};
