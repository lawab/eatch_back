const { actionTypes } = require("../statusTypes");
const mongoose = require("mongoose");

const promotionType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant: {
    _id: { type: mongoose.Types.ObjectId, required: true },
    restaurant_name: String,
    infos: {
      town: { type: String },
      address: { type: String },
      logo: { type: String },
    },
  },
  description: { type: String },
  promotion_name: { type: String },
  clients: [
    {
      _id: { type: mongoose.Types.ObjectId, required: true },
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
      createdAt: Date,
      updatedAt: Date,
      deletedAt: { type: Date, default: null },
    },
  ],
  end_date: { type: Date },
  percent: { type: Number },
  product: {
    _id: { type: mongoose.Types.ObjectId, required: true },
    pusharePrice: {
      type: Number,
    },
    costPrice: {
      type: Number,
    },
    sellingPrice: {
      type: Number,
    },
    productName: {
      type: String,
    },
    recette: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      title: { type: String },
      image: { type: String },
      description: { type: String },
      engredients: [
        {
          material: { type: mongoose.Types.ObjectId },
          grammage: { type: Number },
          unity: String,
        },
      ],
      _creator: {
        type: mongoose.Types.ObjectId,
      },
      deletedAt: { type: Date },
    },
  },
  menu: {
    _id: { type: mongoose.Types.ObjectId, required: true },
    restaurant: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      restaurant_name: String,
      infos: {
        town: { type: String },
        address: { type: String },
        logo: { type: String },
      },
    },
    price: { type: Number, required: true },
    devise: {
      type: String,
    },
    products: [
      {
        _id: { type: mongoose.Types.ObjectId, required: true },
        pusharePrice: {
          type: Number,
        },
        costPrice: {
          type: Number,
        },
        sellingPrice: {
          type: Number,
        },
        productName: {
          type: String,
        },
        recette: {
          _id: { type: mongoose.Types.ObjectId, required: true },
          title: { type: String },
          image: { type: String },
          description: { type: String },
          engredients: [
            {
              material: { type: mongoose.Types.ObjectId },
              grammage: { type: Number },
              unity: String,
            },
          ],
          _creator: {
            type: mongoose.Types.ObjectId,
          },
          deletedAt: { type: Date },
        },
      },
    ],
    description: { type: String },
    menu_title: { type: String },
    image: { type: String },
  },
  image: { type: String },
  _creator: {
    type: mongoose.Types.ObjectId,
    required: true,
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
  promotionType,
};
