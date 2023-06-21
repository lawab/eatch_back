const { actionTypes } = require("../statusTypes");
const mongoose = require("mongoose");
const userType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant: {
    _id: { type: mongoose.Types.ObjectId },
    restaurant_name: String,
    infos: {
      town: String,
      address: String,
      logo: String,
    },
  },
  laboratory: {
    _id: { type: mongoose.Types.ObjectId },
    labo_name: { type: String },
    address: { type: String },
    email: {
      type: String,
    },
    materials: [
      {
        material: { type: String, require: false, maxlength: 50 },
        mp_name: { type: String, require: false, maxlength: 50 },
        stock: { type: Number, require: false, maxlength: 50 },
      },
    ],

    providers: [
      {
        owner: { type: Object },
        restaurant: { type: Object },
        material: { type: Object },
        grammage: { type: Number, require: false },
        date_provider: { type: Date, require: false },
      },
    ],

    _creator: {
      type: mongoose.Types.ObjectId,
    },
    deletedAt: { type: Date, default: null },
  },

  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  employer_type: {
    type: String,
  },
  avatar: {
    type: String,
  },

  isOnline: {
    type: Boolean,
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
  userType,
};
