const print = require("../log/print");
const logisticServices = require("../services/logisticServices");
const roles = require("../models/roles");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");

// create one logistic in database
const createLogistic = async (req, res) => {
  let newElement = null;
  try {
    let body = req.body;

    let creator = await logisticServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
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

    if (!restaurant) {
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

    // create new logistic

    newElement = await logisticServices.createLogistic(body);

    print({ newElement }, "*");

    if (newElement?._id) {
      let response = await addElementToHistorical(
        async () => {
          return await logisticServices.addElementToHistorical(
            newElement._creator._id,
            {
              logistics: {
                _id: newElement._id,
                action: "CREATED",
              },
            },
            req.token
          );
        },
        async () => {
          let elementDeleted = await logisticServices.deleteTrustlyElement({
            _id: newElement._id,
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
    if (newElement) {
      let elementDeleted = await logisticServices.deleteTrustlyElement({
        _id: newElement._id,
      });
      print({ elementDeleted });
    }
    print(error, "x");
    return res
      .status(500)
      .json({ message: "Error occured during a creation of logistic!!!" });
  }
};
// update logistic in database
const updateLogistic = async (req, res) => {
  let logisticCopy = null;
  let logisticUpdated = null;
  try {
    let body = req.body;

    let creator = await logisticServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
      return res.status(401).json({
        message:
          "your cannot update logistic element because you don't have an authorization,please see your administrator",
      });
    }

    //set creator found in database
    body["_creator"] = creator;

    body["image"] = req.file ? "/datas/" + req.file?.filename : body["image"]; //set image for logistic

    // if restaurant value exists update it with new content found in database
    let restaurant = await logisticServices.getRestaurant(
      req?.params?.id,
      req.token
    );

    if (!restaurant) {
      return res.status(401).json({
        message: "you cannot update logistic because restauranst not exists!!!",
      });
    }

    //set restaurant found in database
    body["restaurant"] = restaurant;

    let logistic = await logisticServices.findLogistic({
      _id: req.params?.id,
    });

    if (!logistic?._id) {
      return res.status(401).json({
        message: "unable to update logistic because it not exists!!!",
      });
    }

    // copy document
    logisticCopy = Object.assign({}, logistic._doc);

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
    logisticUpdated = await logistic.save();

    print({ logisticUpdated }, "*");

    if (logisticUpdated?._id) {
      let response = await addElementToHistorical(
        async () => {
          return await logisticServices.addElementToHistorical(
            logisticUpdated._creator._id,
            {
              logistics: {
                _id: logisticUpdated._id,
                action: "UPDATED",
              },
            },
            req.token
          );
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
      if (logisticUpdated && logisticCopy) {
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
  let logisticCopy = null;
  let logisticDeleted = null;
  try {
    let body = req.body;

    let creator = await logisticServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
      return res.status(401).json({
        message:
          "your cannot delete logistic element because you don't have an authorization,please see your administrator",
      });
    }

    let logistic = await logisticServices.findLogistic({
      _id: req.params?.id,
      deletedAt: null,
    });

    if (!logistic) {
      return res.status(401).json({
        message:
          "unable to delete a logistic because it not exists or already be deleted!!!",
      });
    }

    logisticCopy = Object.assign({}, logistic._doc); // cppy documment before update it

    print({ logisticCopy });

    logistic.deletedAt = Date.now();
    logistic._creator = creator;

    // find and delete logistic
    logisticDeleted = await logistic.save();

    print({ logisticDeleted });
    // logistic exits and had deleted successfully
    if (logisticDeleted?.deletedAt) {
      let response = await addElementToHistorical(
        async () => {
          return await logisticServices.addElementToHistorical(
            logisticDeleted._creator._id,
            {
              logistics: {
                _id: logisticDeleted._id,
                action: "DELETED",
              },
            },
            req.token
          );
        },
        async () => {
          // restore only fields would had changed in database
          logisticDeleted["deletedAt"] = logisticCopy["deletedAt"];
          logisticDeleted["updatedAt"] = logisticCopy["updatedAt"];
          logisticDeleted["createdAt"] = logisticCopy["createdAt"];
          let logisticRestored = await logisticDeleted.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ logisticRestored });
          return logisticRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "Logistic has been deleted successfully!!!",
        "Logistic has not been deleted successfully,please try again later,thanks!!!"
      );
    } else {
      return res.status(500).json({ message: "deletion of logistic failed" });
    }
  } catch (error) {
    if (logisticDeleted && logisticCopy) {
      // restore only fields would had changed in database
      logisticDeleted["deletedAt"] = logisticCopy["deletedAt"];
      logisticDeleted["updatedAt"] = logisticCopy["updatedAt"];
      logisticDeleted["createdAt"] = logisticCopy["createdAt"];
      let logisticRestored = await logisticDeleted.save({
        timestamps: false,
      }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
      print({ logisticRestored });
    }
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
