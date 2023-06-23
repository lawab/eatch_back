const { actionTypes } = require("../statusTypes");
const mongoose = require("mongoose");

const categeryType = {
  title: { type: String },
  image: { type: String },
  restaurant: {
    _id: { type: String, required: true },
    restaurant_name: { type: String },
    logo: { type: String },
  },
  _creator: {
    required: true,
    type: {
      _id: { type: String },
      role: { type: String },
      email: { type: String },
      firstName: { type: String },
      lastName: { type: String },
    },
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
  categeryType,
};
