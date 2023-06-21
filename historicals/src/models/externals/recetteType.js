const { actionTypes } = require("../statusTypes");
const mongoose = require("mongoose");

const recetteType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  title: { type: String },
  image: { type: String },
  description: { type: String },
  engredients: [
    {
      material: {
        _id: { type: mongoose.Types.ObjectId },
        restaurant: {
          _id: { type: mongoose.Types.ObjectId },
          restaurant_name: String,
          infos: {
            town: String,
            address: String,
            logo: String,
          },
        },
        lifetime: Date,
        image: { type: String },
        mp_name: { type: String },
        quantity: {
          type: Number,
        },
        consumer_quantity: { type: Number },
        current_quantity: { type: Number },
        unity: {
          type: String,
        },
        _creator: {
          type: mongoose.Types.ObjectId,
        },
        createdAt: Date,
        updatedAt: Date,
        deletedAt: { type: Date, default: null },
      },
      grammage: { type: Number },
      unity: String,
    },
  ],
  _creator: {
    type: mongoose.Types.ObjectId,
    required: true,
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
  recetteType,
};
