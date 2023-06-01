const { fieldsRequired } = require("../models/historical/historical");
const { fieldsValidator } = require("../models/historical/validators");
const historicalServices = require("../services/historicalServices");
const roles = require("../models/roles");
const setValuesBody = require("./setValuesBody");
const { actionTypes, orderStatus } = require("../models/statusTypes");
// create one historical in database
const updateHistorical = async (req, res) => {
  try {
    let body = req.body;

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

    // valid and set all value into body
    body = await setValuesBody(historicalServices, body, req.token);

    console.log({ body });

    if (!body) {
      return res.status(401).json({
        message:
          "unable to end the current action because data send had not valided!!!",
      });
    }
    // update historical
    let [key] = Object.keys(body);

    historical[key] = [...historical[key], body[key]];

    let updatedHistoricalResponse = await historical.save();

    console.log({ updatedHistoricalResponse }, "*");

    if (updatedHistoricalResponse?._id) {
      res
        .status(200)
        .json({ message: "HIstorical has been updated successfully!!!" });
    } else {
      res
        .status(401)
        .json({ message: "HIstorical has been not updated successfully!!!" });
    }
  } catch (error) {
    console.log(error, "x");
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
    console.log({ params: req?.params, fields });
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
    console.log({
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
  updateHistorical,
  fetchHistorical,
  fetchHistoricalsByField,
  fetchHistoricalByFieldWithAction,
};
