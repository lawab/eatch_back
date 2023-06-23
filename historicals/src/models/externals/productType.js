const mongoose = require("mongoose");
const { actionTypes } = require("../statusTypes");

const productType = {
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
  comments: [
    {
      client: {
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
      },
      message: { type: String },
      deletedAt: { type: Date },
    },
  ],
  recette: {
    _id: { type: mongoose.Types.ObjectId },
    title: { type: String, maxlength: 50 },
    image: { type: String },
    description: { type: String, maxlength: 50 },
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
        raw_material: {
          title: { type: String },
          quantity: { type: Number },
          unit: { type: String },
          lifetime: { type: Date },
          image: { type: String, default: "/datas/avatar.png" },
          _creator: {
            _id: { type: String },
            role: { type: String },
            email: { type: String },
            firstName: { type: String },
            lastName: { type: String },
          },
          laboratory: {
            type: mongoose.Types.ObjectId,
            ref: "Laboratory",
          },
          deletedAt: { type: Date, default: null },
        },
        grammage: { type: Number },
        unity: { type: String },
      },
    ],
    _creator: {
      type: mongoose.Types.ObjectId,
    },
    deletedAt: { type: Date },
  },

  category: {
    _id: { type: mongoose.Types.ObjectId },
    title: { type: String },
    image: { type: String },
    _creator: {
      _id: { type: String },
      role: { type: String },
      email: { type: String },
      firstName: { type: String },
      lastName: { type: String },
    },
    restaurant: {
      _id: { type: String },
      restaurant_name: { type: String },
      logo: { type: String },
    },
    deletedAt: { type: Date },
  },
  price: {
    type: Number,
  },
  quantity: { type: Number },
  productName: {
    type: String,
  },

  pusharePrice: {
    type: Number,
  },
  costPrice: {
    type: Number,
  },
  sellingPrice: {
    type: Number,
  },

  promotion: {
    type: Boolean,
  },
  description: {
    type: String,
  },
  devise: {
    type: String,
  },
  cookingtime: {
    type: String,
  },

  image: {
    type: String,
  },
  liked: {
    type: Number,
  },
  likedPersonCount: {
    type: Number,
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
  productType,
};
