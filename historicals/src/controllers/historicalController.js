const { fieldsRequired } = require("../models/historical/historical");
const { fieldsValidator } = require("../models/historical/validators");
const print = require("../log/print");
const historicalServices = require("../services/historicalServices");
const roles = require("../models/roles");
const setValuesBody = require("./setValuesBody");
const { actionTypes, orderStatus } = require("../models/statusTypes");
// create one historical in database
const createHistorical = async (req, res) => {
  try {
    let body = req.body;

    // verify fields on body
    let { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

    // if body have invalid fields
    if (!validate) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    // get author since microservice clients
    let creator = await historicalServices.getUser(
      req.params?._creator,
      req.token
    );

    print({ creator });

    // if creator not exists in database
    if (!creator?._id) {
      return res.status(401).json({
        message:
          "invalid data send you must authenticated to create a new historique",
      });
    }

    // if user has authorization to create new product
    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "you cannot create the invoice because you don't have authorization,please see your administrator,thanks!!!",
      });
    }

    // valid and set all value into body
    body = await setValuesBody(historicalServices, body, creator, req.token);
    print({ bodyUpdated: body });
    // save all value into database
    let historical = await historicalServices.findHIstorical({
      _id: { $exists: true },
    });

    if (!historical?._id) {
      res.status(401).json({
        message:
          "unable to end the current action because historical not exists please see your administrator for more information!!!",
      });
    }
    for (const key in body) {
      if (
        Object.hasOwnProperty.call(body, key) &&
        fieldsRequired.includes(key)
      ) {
        console.log({ body });
        body[key] = [...historical[key], body[key]];
      }
    }

    let updatedHistoricalResponse = await historicalServices.createHIstorical(
      {
        _id: historical?._id,
      },
      body
    );

    print({ updatedHistoricalResponse }, "*");

    if (updatedHistoricalResponse?.modifiedCount) {
      res
        .status(200)
        .json({ message: "HIstorical has been created successfully!!!" });
    } else {
      res
        .status(401)
        .json({ message: "HIstorical has been not created successfully!!!" });
    }
  } catch (error) {
    print(error, "x");
    return res
      .status(500)
      .json({ message: "Error occured during a creation of historical!!!" });
  }
};

// get one historical in database
const fetchHistorical = async (req, res) => {
  try {
    let historical = await historicalServices.findHIstorical({
      _id: req.params?.id,
    });
    res.status(200).json(historical);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch historicals by restaurant in database
const fetchHistoricalsByField = async (req, res) => {
  try {
    let fields = Object.values(req?.params);
    // verify fields on body
    let { validate } = fieldsValidator(fields, fieldsRequired);
    print({ params: req?.params, fields });
    // if body have invalid fields
    if (!validate) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    let historicals = await historicalServices.findHIstorical({
      [fields[0]]: { $exists: true },
    });
    res.status(200).json(historicals[fields[0]]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch historicals by restaurant in database
const fetchHistoricalByFieldWithAction = async (req, res) => {
  try {
    let field = req?.params?.field;
    let action = req.params?.action;
    // verify fields on body
    print({
      params: req?.params,
    });
    // if body have invalid fields
    if (
      !fieldsRequired.includes(field) ||
      ![...Object.values(orderStatus), ...Object.values(actionTypes)].includes(
        action
      )
    ) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    let queryKey = `${field}.action`;

    let historicals = await historicalServices.findHIstorical({
      [queryKey]: action,
    });
    let data = [];
    if (historicals?._id) {
      data = historicals[field].filter((f) => f["action"] === action);
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

module.exports = {
  createHistorical,
  fetchHistorical,
  fetchHistoricalsByField,
  fetchHistoricalByFieldWithAction,
};
