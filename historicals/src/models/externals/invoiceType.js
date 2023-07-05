const { actionTypes } = require("../statusTypes");
const mongoose = require("mongoose");

const invoiceType = {
  _id: { type: mongoose.Types.ObjectId },
  order: {
    _id: { type: mongoose.Types.ObjectId },
    order_title: {
      type: String,
    },
    restaurant: {
      _id: { type: mongoose.Types.ObjectId },
      restaurant_name: String,
      infos: {
        town: { type: String },
        address: { type: String },
        logo: { type: String },
      },
    },
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
    products: [
      {
        _id: { type: mongoose.Types.ObjectId },
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
          _id: { type: mongoose.Types.ObjectId },
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
    menus: [
      {
        _id: { type: mongoose.Types.ObjectId },
        menu_title: { type: String },
        restaurant: {
          _id: { type: mongoose.Types.ObjectId },
          restaurant_name: String,
          infos: {
            town: { type: String },
            address: { type: String },
            logo: { type: String },
          },
        },
        price: { type: Number },
        devise: {
          type: String,
        },
        products: [
          {
            _id: { type: mongoose.Types.ObjectId },
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
              _id: { type: mongoose.Types.ObjectId },
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
        _creator: {
          type: mongoose.Types.ObjectId,
        },
        description: { type: String },
        image: { type: String },
        deletedAt: { type: Date },
      },
    ],
    is_tracking: { type: Boolean },
    status: {
      type: String,
    },
  },
  restaurant: {
    _id: { type: mongoose.Types.ObjectId },
    restaurant_name: String,
    infos: {
      town: { type: String },
      address: { type: String },
      logo: { type: String },
    },
  },
  devise: { type: String },
  image: { type: String },
  total: { type: Number },
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
  invoiceType,
};
