const {
  dynamicTypeRequired,
  promotionSchema,
} = require("../models/promotion/promotion");
const print = require("../log/print");
const promotionServices = require("../services/promotionServices");
const roles = require("../models/roles");
const { default: mongoose } = require("mongoose");
const setValuesFromRequiredForeignFields = require("./setValuesFromRequiredForeignFields");

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

    body = await setValuesFromRequiredForeignFields(body, req.token);

    // verify that document with [field] exists
    let newPromotion = await promotionServices.createPromotion(body);

    // if field already exists,document must be found on database,or null in ortherwise
    if (newPromotion?._id) {
      print({ newPromotion });
      return res.status(200).json({
        message: "Promotion has been created successfully!!!",
      });
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

    // if restaurant value exists update it with new content found in database
    if (body?.restaurant) {
      let restaurant = await promotionServices.getRestaurant(
        req?.params?.id,
        req.token
      );

      if (!restaurant?._id) {
        return res.status(401).json({
          message:
            "you cannot update promotion because restauranst not exists!!!",
        });
      }
      body["restaurant"] = restaurant; //set restaurant found in database
    }

    let promotionFound = await promotionServices.findPromotion({
      _id: req.params?.id,
    });

    if (!promotionFound?._id) {
      return res.status(401).json({
        message: "unable to update promotion because it not exists!!!",
      });
    }

    promotionSchema.add(dynamicTypeRequired); // add dynamic field in default schema mongoose

    let Promotion = mongoose.model("Promotion", promotionSchema); // create new model with new field added

    let promotionUpdated = await Promotion.updateOne(
      { _id: promotionFound?._id },
      {
        ...body,
      }
    );

    print({ promotionUpdated }, "*");

    if (promotionUpdated?.modifiedCount) {
      res
        .status(200)
        .json({ message: "Promotion has been updated successfully!!" });
    } else {
      res.status(401).json({
        message: "Promotion has been not updated successfully!!",
      });
    }
  } catch (error) {
    print(error, "x");
    res.status(500).json({
      message: "Erros occured during the update promotion!!!",
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

    // find and delete promotion
    let promotionDeleted = await promotionServices.deleteOne(
      {
        _id: req.params?.id,
        deletedAt: null,
      },
      { deletedAt: Date.now(), _creator: creator } //set date of deletion and client who delete promotion,no drop promotion
    );

    // if promotion not exits or had already deleted
    if (!promotionDeleted?._id) {
      return res.status(401).json({
        message:
          "unable to delete a promotion because it not exists or already be deleted!!!",
      });
    }

    // promotion exits and had deleted successfully
    if (promotionDeleted?.deletedAt) {
      print({ promotionDeleted });
      return res
        .status(200)
        .json({ message: "promotion has been deleted sucessfully" });
    } else {
      return res.status(500).json({ message: "deletion of promotion failed" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Error(s) occured during the deletion of promotion!!!",
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

module.exports = {
  createPromotion,
  deletePromotion,
  fetchPromotions,
  updatePromotion,
  fetchPromotion,
  fetchPromotionsByRestaurant,
};
