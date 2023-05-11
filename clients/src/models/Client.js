const mongoose = require("mongoose");
const { isEmail } = require("validator");
const status = require("../models/status");
const productType = {
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
    maxlength: 50,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      category_name: { type: String, maxlength: 50 },
    },
    required: true,
  },
  promotion: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  devise: {
    type: String,
    default: "MAD",
  },
  image: {
    type: String,
    default: "/data/uploads/mcf.png",
  },
  liked: {
    type: Number,
    default: 0,
  },

  likedPersonCount: {
    type: Number,
    default: 0,
  },
};

const clientSchemaObject = {
  commandes: {
    type: [
      {
        _id: { type: String },
        order_title: {
          type: String,
          default: null,
        },
        products: {
          required: false,
          type: [{ type: productType }],
        },
      },
    ],
  },
  status: {
    type: String,
    enum: [status.DONE, status.TREATMENT, status.PAID, status.WAITED],
    default: status.WAITED,
  },

  firstname: { type: String, required: true, default: null, maxlength: 50 },

  restaurant: {
    required: true,
    type: {
      _id: { type: String },
      restaurant_name: { type: String, maxlength: 50 },
      info: {
        town: { type: String },
        address: { type: String },
        logo: { type: String },
      },
    },
  },
  is_auth: { type: Boolean, maxlength: 50 },

  lastname: { type: String, default: null, maxlength: 50 },

  email: {
    type: String,
    validate: {
      validator: function (V) {
        return isEmail(V);
      },
    },
    maxlength: 50,
  },
  phone_number: { type: String },

  isOnline: { type: Boolean, default: false },

  products_liked: [{ type: productType }],

  deletedAt: { type: Date, default: null },
};

const ClientSchema = new mongoose.Schema(clientSchemaObject, {
  timestamps: true,
});

module.exports.fieldsRequired = Object.keys(clientSchemaObject);
module.exports.Client = mongoose.model("Client", ClientSchema);
module.exports.clientFieldsRequired = Object.keys(clientSchemaObject);
