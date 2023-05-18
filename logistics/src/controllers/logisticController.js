const {
  dynamicTypeRequired,
  logisticSchema,
} = require("../models/logistic/logistic");
const print = require("../log/print");
const logisticServices = require("../services/logisticServices");
const roles = require("../models/roles");
const { default: mongoose } = require("mongoose");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");

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

    body["image"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png"; //set image for logistic

    // verify that document with [field] exists
    let element = await logisticServices.findLogistic({
      name: body?.name,
    });

    // if field already exists,document must be found on database,or null in ortherwise
    if (element) {
      return res.status(401).json({
        message: "Logistic element  already exists, please create another!!!",
      });
    }

    // create new filed with dynamically

    let newElement = await Logistic.create(body);

    print({ newElement }, "*");

    if (newElement?._id) {
      let response = await addElementToHistorical(
        async () => {
          let addResponse = await logisticServices.addElementToHistorical(
            creator._id,
            {
              logistics: {
                _id: newElement?._id,
                action: "CREATED",
              },
            },
            req.token
          );

          return addResponse;
        },
        async () => {
          let elementDeleted = await logisticServices.deleteTrustlyElement({
            _id: newElement?._id,
          });
          print({ elementDeleted });
          return elementDeleted;
        }
      );

      return closeRequest(
        response,
        res,
        "Logistic has been created successfully!!!",
        "Logistic has  been not created successfully,please try again later,thanks!!!"
      );
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

    body["image"] = req.file ? "/datas/" + req.file?.filename : body["image"]; //set image for logistic

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

    let logistic = await logisticServices.findLogistic({
      _id: req.params?.id,
    });

    if (!logistic?._id) {
      return res.status(401).json({
        message: "unable to update logistic because it not exists!!!",
      });
    }

    let logisticCopy = Object.assign({}, logistic._doc); // cppy documment before update it

    print({ logisticCopy });

    // update all valid fields before save it in database
    for (let key in body) {
      logistic[key] = body[key];
    }

    // update avatar if exists
    logistic["image"] = req.file
      ? "/datas/" + req.file?.filename
      : logistic["image"];

    // update field in database
    let logisticUpdated = await logistic.save();

    print({ logisticUpdated }, "*");

    if (logisticUpdated?._id) {
      let response = await addElementToHistorical(
        async () => {
          let response = await logisticServices.addElementToHistorical(
            creator?._id,
            {
              logistics: {
                _id: logisticUpdated?._id,
                action: "UPDATED",
              },
            },
            req.token
          );

          return response;
        },
        async () => {
          for (const field in logisticCopy) {
            if (Object.hasOwnProperty.call(logisticCopy, field)) {
              logisticUpdated[field] = logisticCopy[field];
            }
          }
          let logisticRestored = await logisticUpdated.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ logisticRestored });
          return logisticRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "Logistic has been updated successfully!!!",
        "Logistic has not been Updated successfully,please try again later,thanks!!!"
      );
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
