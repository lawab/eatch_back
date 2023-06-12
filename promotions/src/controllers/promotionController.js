const promotionServices = require("../services/promotionServices");
const roles = require("../models/roles");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");
const setPromotionValues = require("../methods/setPromotionValues");
const updateValuesPromotion = require("../methods/updateValuesPromotion");

// create one promotion in database
const createPromotion = async (req, res) => {
  let newPromotion = null;
  try {
    // let body = req.body;
    let body = JSON.parse(req.headers.body);

    console.log({ body });

    let bodyUpdate = await setPromotionValues(req, body, req.token);

    newPromotion = await promotionServices.createPromotion(bodyUpdate);

    console.log({ newPromotion });
    // if field already exists,document must be found on database,or null in ortherwise
    if (newPromotion?._id) {
      let response = await addElementToHistorical(
        async () => {
          let addResponse = await promotionServices.addPromotionToHistorical(
            newPromotion._creator._id,
            {
              promotions: {
                _id: newPromotion._id,
                action: "CREATED",
              },
            },
            req.token
          );

          return addResponse;
        },
        async () => {
          let elementDeleted = await promotionServices.deleteTrustlyPromotion({
            _id: newPromotion._id,
          });
          console.log({ elementDeleted });
          return elementDeleted;
        }
      );

      if (response.status === 200) {
        return res
          .status(200)
          .json({ message: "Promotion has been created successfully!!!" });
      } else {
        return res.status(500).json({
          message:
            "creation of promotion failled,please try again later,thanks!!!",
        });
      }
    } else {
      return res.status(500).json({
        message:
          "creation of promotion failled,please try again later,thanks!!!",
      });
    }
  } catch (error) {
    if (newPromotion) {
      let elementDeleted = await promotionServices.deleteTrustlyPromotion({
        _id: newPromotion?._id,
      });
      console.log({ elementDeleted });
      return elementDeleted;
    }
    console.log(error, "x");
    return res
      .status(500)
      .json({ message: "Error occured during a creation of promotion!!!" });
  }
};
// update promotion in database
const updatePromotion = async (req, res) => {
  let promotionUpdated = null;
  let promotionCopy = null;

  try {
    // let body = req.body;
    let body = JSON.parse(req.headers.body);

    bodyUpdate = await updateValuesPromotion(req, body, req.token);

    let promotion = await promotionServices.findOnePromotion({
      _id: req.params?.id,
    });

    if (!promotion) {
      return res.status(401).json({
        message:
          "your cannot update promotion element because it not exists!!!",
      });
    }

    // copy promotion value to do fallback if error occured
    promotionCopy = Object.assign({}, promotion._doc);
    console.log({ client: promotion["client"] });
    // update promotion values
    for (const field in bodyUpdate) {
      if (Object.hasOwnProperty.call(bodyUpdate, field)) {
        if (field === "client") {
          promotion["clients"] = [...promotion["clients"], bodyUpdate[field]];
        } else {
          promotion[field] = bodyUpdate[field];
        }
      }
    }

    promotionUpdated = await promotion.save();

    console.log({ promotionUpdated }, "~");

    if (promotionUpdated?._id) {
      let response = await addElementToHistorical(
        async () => {
          let addResponse = await promotionServices.addPromotionToHistorical(
            promotionUpdated._creator._id,
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
          console.log({ promotionRestored });
          return promotionRestored;
        }
      );

      if (response.status === 200) {
        return res
          .status(200)
          .json({ message: "Promotion has been update successfully!!!" });
      } else {
        return res.status(500).json({
          message:
            "Updating of promotion failled,please try again later,thanks!!!",
        });
      }
    } else {
      res.status(401).json({
        message:
          "Updating of promotion failled,please try again later,thanks!!!",
      });
    }
  } catch (error) {
    console.log(error, "x");
    res.status(500).json({
      message: "Error occured during the update promotion!!!",
    });
  }
};
// delete one promotion in database
const deletePromotion = async (req, res) => {
  let promotionCopy;
  let promotionDeleted = null;
  try {
    // let body = req.body;
    let body = JSON.parse(req.headers.body);

    let creator = await promotionServices.getUserAuthor(
      body?._creator,
      req.token
    );

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
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

    promotionCopy = Object.assign({}, promotion._doc); // copy promotion value to do fallback if error occured

    console.log({ promotionCopy });

    promotion.deletedAt = Date.now();
    promotion._creator = creator;

    // find and delete promotion
    promotionDeleted = await promotion.save();

    console.log({ promotionDeleted });

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
          // restore only fields would had changed in database
          promotionDeleted["deletedAt"] = promotionCopy["deletedAt"];
          promotionDeleted["updatedAt"] = promotionCopy["updatedAt"];
          promotionDeleted["createdAt"] = promotionCopy["createdAt"];

          let promotionRestored = await promotionDeleted.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          console.log({ promotionRestored });
          return promotionRestored;
        }
      );

      if (response.status === 200) {
        return res
          .status(200)
          .json({ message: "Promotion has been deleted successfully!!!" });
      } else {
        return res.status(500).json({
          message:
            "Deleting of promotion failled,please try again later,thanks!!!",
        });
      }
    }
  } catch (error) {
    if (promotionDeleted && promotionCopy) {
      // restore only fields would had changed in database
      promotionDeleted["deletedAt"] = promotionCopy["deletedAt"];
      promotionDeleted["updatedAt"] = promotionCopy["updatedAt"];
      promotionDeleted["createdAt"] = promotionCopy["createdAt"];

      let promotionRestored = await promotionDeleted.save({
        timestamps: false,
      }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
      console.log({ promotionRestored });
      return promotionRestored;
    }
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
      console.log({ clientAdded });
      res
        .status(200)
        .json({ message: "client has been added to promotion successfully!!" });
    } else {
      res.status(401).json({
        message: "client has been not added to promotion successfully!!",
      });
    }
  } catch (error) {
    console.log(error, "x");
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
