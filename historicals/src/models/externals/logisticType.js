const { actionTypes } = require("../statusTypes");
const mongoose = require("mongoose");

const logisticType = {
  _id: { type: mongoose.Types.ObjectId },
  restaurant: {
    _id: { type: mongoose.Types.ObjectId },
    restaurant_name: String,
    infos: {
      town: { type: String },
      address: { type: String },
      logo: { type: String },
    },
  },
  image: { type: String },
  name: { type: String },
  price: { type: Number },
  devise: { type: String },
  quantity: { type: Number },
  _creator: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
  action: {
    required: true,
    type: String,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: { type: Date, default: null },
};

module.exports = {
  logisticType,
};
