const { actionTypes } = require("../statusTypes");
const mongoose = require("mongoose");

const restaurantType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: { type: String, required: true },
  infos: {
    town: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String },
  },
  _creator: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: { type: Date, default: null },
};

module.exports = {
  restaurantType,
};
