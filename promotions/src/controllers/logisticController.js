const {
  dynamicTypeRequired,
  logisticSchema,
} = require("../models/logistic/logistic");
const print = require("../log/print");
const logisticServices = require("../services/logisticServices");
const roles = require("../models/roles");
const { default: mongoose } = require("mongoose");

// create one logistic in database
const createLogistic = async (req, res) => {
  try {
    let body = req.body;

    let creator = await logisticServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (!creator?._id) {
      return res.status(401).json({
        message: "unable to create this logistic because creator not exists!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot create logistic element because you don't have an authorization,please see your administrator",
      });
    }

    body["_creator"] = creator; //set creator found in database

    let restaurant = await logisticServices.getRestaurant(
      req?.params?.id,
      req.token
    );

    if (!restaurant?._id) {
      return res.status(401).json({
        message: "you cannot create logistic because restauranst not exists!!!",
      });
    }

    body["restaurant"] = restaurant; //set restaurant found in database

    // verify that document with [field] exists
    let element = await logisticServices.findLogistic({
      name: body?.name,
    });

    // if field already exists,document must be found on database,or null in ortherwise
    if (element) {
      return res.status(401).json({
        message:
          "Logistic element name already exists, please take another name!!!",
      });
    }

    // create new filed with dynamically

    print({ dynamicTypeRequired });

    logisticSchema.add(dynamicTypeRequired); // add dynamic field in default schema mongoose

    let Logistic = mongoose.model("Logistic", logisticSchema); // create new model with new field added

    let newElement = await Logistic.create(body);

    print({ newElement }, "*");

    if (newElement?._id) {
      res
        .status(200)
        .json({ message: "Logistic has been created successfully!!!" });
    } else {
      res
        .status(401)
        .json({ message: "Logistic has been not created successfully!!!" });
    }
  } catch (error) {
    print(error, "x");
    return res
      .status(500)
      .json({ message: "Error occured during a creation of logistic!!!" });
  }
};
// update logistic in database
const updateLogistic = async (req, res) => {
  try {
    let body = req.body;

    let creator = await logisticServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "unable to update this logistic element because creator not exists!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot update logistic element because you don't have an authorization,please see your administrator",
      });
    }

    //set creator found in database
    body["_creator"] = creator;

    // if restaurant value exists update it with new content found in database
    if (body?.restaurant) {
      let restaurant = await logisticServices.getRestaurant(
        req?.params?.id,
        req.token
      );

      if (!restaurant?._id) {
        return res.status(401).json({
          message:
            "you cannot update logistic because restauranst not exists!!!",
        });
      }
      body["restaurant"] = restaurant; //set restaurant found in database
    }

    let logisticFound = await logisticServices.findLogistic({
      _id: req.params?.id,
    });

    if (!logisticFound?._id) {
      return res.status(401).json({
        message: "unable to update logistic because it not exists!!!",
      });
    }

    logisticSchema.add(dynamicTypeRequired); // add dynamic field in default schema mongoose

    let Logistic = mongoose.model("Logistic", logisticSchema); // create new model with new field added

    let logisticUpdated = await Logistic.updateOne(
      { _id: logisticFound?._id },
      {
        ...body,
      }
    );

    print({ logisticUpdated }, "*");

    if (logisticUpdated?.modifiedCount) {
      res
        .status(200)
        .json({ message: "Logistic has been updated successfully!!" });
    } else {
      res.status(401).json({
        message: "Logistic has been not updated successfully!!",
      });
    }
  } catch (error) {
    print(error, "x");
    res.status(500).json({
      message: "Erros occured during the update logistic!!!",
    });
  }
};
// delete one logistic in database
const deleteLogistic = async (req, res) => {
  try {
    let body = req.body;

    let creator = await logisticServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "unable to delete this logistic element because creator not exists!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot delete logistic element because you don't have an authorization,please see your administrator",
      });
    }

    // find and delete logistic
    let logisticDeleted = await logisticServices.deleteOne(
      {
        _id: req.params?.id,
        deletedAt: null,
      },
      { deletedAt: Date.now(), _creator: creator } //set date of deletion and client who delete logistic,no drop logistic
    );

    // if logistic not exits or had already deleted
    if (!logisticDeleted?._id) {
      return res.status(401).json({
        message:
          "unable to delete a logistic because it not exists or already be deleted!!!",
      });
    }

    // logistic exits and had deleted successfully
    if (logisticDeleted?.deletedAt) {
      print({ logisticDeleted });
      return res
        .status(200)
        .json({ message: "logistic has been deleted sucessfully" });
    } else {
      return res.status(500).json({ message: "deletion of logistic failed" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error(s) occured during the deletion of logistic!!!" });
  }
};
// get one logistic in database
const fetchLogistic = async (req, res) => {
  try {
    let logistic = await logisticServices.findLogistic({
      _id: req.params?.id,
    });
    res.status(200).json(logistic);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};
// get logistics in database
const fetchLogistics = async (_, res) => {
  try {
    let logistics = await logisticServices.findLogistics();
    res.status(200).json(logistics);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch logistics by restaurant in database
const fetchLogisticsByRestaurant = async (req, res) => {
  try {
    let logistics = await logisticServices.findLogistics({
      "restaurant._id": req.params?.id,
    });
    res.status(200).json(logistics);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

module.exports = {
  createLogistic,
  deleteLogistic,
  fetchLogistics,
  updateLogistic,
  fetchLogistic,
  fetchLogisticsByRestaurant,
};
