const { actionTypes } = require("../statusTypes");
const mongoose = require("mongoose");

const clientType = {
  _id: { type: mongoose.Types.ObjectId },
  fisrtName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  isOnline: { type: Boolean },
  phoneNumber: {
    type: String,
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
  clientType,
};
