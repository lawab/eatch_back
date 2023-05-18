const { Promotion } = require("../models/promotion/promotion");
const print = require("../log/print");
const promotionServices = require("../services/promotionServices");
const roles = require("../models/roles");
const setValuesFromRequiredForeignFields = require("./setValuesFromRequiredForeignFields");
const setUpdateValuesFromForeignFields = require("./setUpdateValuesFromForeignFields");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");

// create one promotion in database
const createPromotion = async (req, res) => {
  try {
    let body = req.body;

    let creator = await promotionServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "unable to create this promotion because creator not exists!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot create promotion element because you don't have an authorization,please see your administrator",
      });
    }

    body["_creator"] = creator; //set creator found in database

    // set promotion avatar
    body["image"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";

    body = await setValuesFromRequiredForeignFields(body, req.token);

    // verify that document with [field] exists
    let newPromotion = await promotionServices.createPromotion(body);

    print({ newPromotion });
    // if field already exists,document must be found on database,or null in ortherwise
    if (newPromotion?._id) {
      let response = await addElementToHistorical(
        async () => {
          let addResponse = await promotionServices.addPromotionToHistorical(
            creator._id,
            {
              promotions: {
                _id: newPromotion?._id,
                action: "CREATED",
              },
            },
            req.token
          );

          return addResponse;
        },
        async () => {
          let elementDeleted = await promotionServices.deleteTrustlyPromotion({
            _id: newPromotion?._id,
          });
          print({ elementDeleted });
          return elementDeleted;
        }
      );

      return closeRequest(
        response,
        res,
        "Promotion has been created successfully!!!",
        "Promotion has  been not created successfully,please try again later,thanks!!!"
      );
    } else {
      res
        .status(401)
        .json({ message: "Promotion has been not created successfully!!!" });
    }
  } catch (error) {
    print(error, "x");
    return res
      .status(500)
      .json({ message: "Error occured during a creation of promotion!!!" });
  }
};
// update promotion in database
const updatePromotion = async (req, res) => {
  try {
    let body = req.body;

    let creator = await promotionServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "unable to update this promotion element because creator not exists!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot update promotion element because you don't have an authorization,please see your administrator",
      });
    }

    //set creator found in database
    body["_creator"] = creator;

    // set promotion avatar if exists
    if (req.file) {
      body["image"] = req.file?.filename;
    }

    let promotion = await promotionServices.findOnePromotion({
      _id: req.params?.id,
    });

    if (!promotion) {
      return res.status(401).json({
        message:
          "your cannot update promotion element because it not exists!!!",
      });
    }

    let promotionCopy = Object.assign({}, promotion._doc); // copy promotion value to do fallback if error occured

    print({ promotionCopy });

    body = await setUpdateValuesFromForeignFields(body, req.token);

    // update promotion values

    for (const field in body) {
      if (Object.hasOwnProperty.call(body, field)) {
        promotion[field] = body[field];
      }
    }

    let promotionUpdated = await promotion.save();

    print({ promotionUpdated }, "~");

    if (promotionUpdated?._id) {
      let response = await addElementToHistorical(
        async () => {
          let addResponse = await promotionServices.addPromotionToHistorical(
            creator._id,
            {
              promotions: {
                _id: promotionUpdated?._id,
                action: "UPDATED",
              },
            },
            req.token
          );

          return addResponse;
        },
        async () => {
          for (const field in promotionCopy) {
            if (Object.hasOwnProperty.call(promotionCopy, field)) {
              promotionUpdated[field] = promotionCopy[field];
            }
          }
          let promotionRestored = await promotionUpdated.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ promotionRestored });
          return promotionRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "Promotion has been updated successfully!!!",
        "Promotion has been not updated successfully,please try again later,thanks!!!"
      );
    } else {
      res.status(401).json({
        message: "Promotion has been not updated successfully!!",
      });
    }
  } catch (error) {
    print(error, "x");
    res.status(500).json({
      message: "Error occured during the update promotion!!!",
    });
  }
};
// delete one promotion in database
const deletePromotion = async (req, res) => {
  try {
    let body = req.body;

    let creator = await promotionServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "unable to delete this promotion element because creator not exists!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot delete promotion element because you don't have an authorization,please see your administrator",
      });
    }

    let promotion = await promotionServices.findOnePromotion({
      _id: req.params?.id,
      deletedAt: null,
    });

    if (!promotion) {
      return res.status(401).json({
        message:
          "unable to delete a promotion because it not exists or already be deleted!!!",
      });
    }

    let promotionCopy = Object.assign({}, promotion._doc); // copy promotion value to do fallback if error occured

    print({ promotionCopy });

    promotion.deletedAt = Date.now();
    promotion._creator = creator;

    // find and delete promotion
    let promotionDeleted = await promotion.save();

    print({ promotionDeleted });

    // promotion exits and had deleted successfully
    if (promotionDeleted?.deletedAt) {
      let response = await addElementToHistorical(
        async () => {
          let response = await promotionServices.addPromotionToHistorical(
            creator?._id,
            {
              promotions: {
                _id: promotionDeleted?._id,
                action: "DELETED",
              },
            },
            req.token
          );

          return response;
        },
        async () => {
          for (const field in promotionCopy) {
            if (Object.hasOwnProperty.call(promotionCopy, field)) {
              promotionDeleted[field] = promotionCopy[field];
            }
          }
          let promotionRestored = await promotionDeleted.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ promotionRestored });
          return promotionRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "Promotion has been delete successfully!!!",
        "Promotion has not been delete successfully,please try again later,thanks!!!"
      );
    } else {
      return res.status(500).json({ message: "deletion of promotion failed" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Error occured during the deletion of promotion!!!",
    });
  }
};
// get one promotion in database
const fetchPromotion = async (req, res) => {
  try {
    let promotion = await promotionServices.findPromotion({
      _id: req.params?.id,
    });
    res.status(200).json(promotion);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};
// get promotions in database
const fetchPromotions = async (_, res) => {
  try {
    let promotions = await promotionServices.findPromotions();
    res.status(200).json(promotions);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch promotions by restaurant in database
const fetchPromotionsByRestaurant = async (req, res) => {
  try {
    let promotions = await promotionServices.findPromotions({
      "restaurant._id": req.params?.id,
    });
    res.status(200).json(promotions);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// add clients to promotion
const addClientToPromotion = async (req, res) => {
  try {
    let body = req.body;

    let creator = await promotionServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "unable to add this client to promotion because creator not exists!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "your cannot add client to promotion because you don't have an authorization,please see your administrator",
      });
    }

    let newClient = await promotionServices.getClient(body?.client, req.token);

    if (!newClient?._id) {
      return res.status(401).json({
        message:
          "unable to add client to promotion because he not have account!!!",
      });
    }

    let clientAdded = await promotionServices.updatePromotion(
      {
        _id: req.params?.id,
      },
      {
        _creator: creator,
        $push: { clients: newClient },
      }
    );

    if (clientAdded?._id) {
      print({ clientAdded });
      res
        .status(200)
        .json({ message: "client has been added to promotion successfully!!" });
    } else {
      res.status(401).json({
        message: "client has been not added to promotion successfully!!",
      });
    }
  } catch (error) {
    print(error, "x");
    res.status(500).json({
      message: "Error occured during added client to promotion!!!",
    });
  }
};

module.exports = {
  createPromotion,
  deletePromotion,
  fetchPromotions,
  updatePromotion,
  fetchPromotion,
  fetchPromotionsByRestaurant,
  addClientToPromotion,
};
