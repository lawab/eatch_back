const mongoose = require("mongoose");
const status = require("./status");
const Schema = mongoose.Schema;
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
    default: "/datas/avatar.png",
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
const clientType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  fisrtName: {
    type: String,
    maxlenght: 50,
    default: null,
  },
  lastName: {
    type: String,
    maxlenght: 50,
    default: null,
  },
  isOnline: { type: Boolean, default: false },
  phoneNumber: {
    type: String,
    maxlenght: 50,
    default: null,
  },
};
const OrderschemaObject = {
  order_title: {
    type: String,
    default: null,
  },
  is_tracking: { type: Boolean, default: false },
  client: { type: clientType, required: true },
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      infos: {
        type: {
          town: { type: String, required: true },
          address: { type: String, required: true },
          restaurant_name: { type: String, required: true },
        },
      },
    },
  },
  _creator: {
    type: mongoose.Types.ObjectId,
    required: false,
    default: null,
  },
  products: {
    required: true,
    type: [{ type: productType }],
  },
  status: {
    type: String,
    enum: [status.DONE, status.TREATMENT, status.PAID, status.WAITED],
    default: status.WAITED,
  },
  deletedAt: { type: Date, default: null },
};
const Orderschema = new Schema(OrderschemaObject, { timestamps: true });

module.exports.fieldsRequired = Object.keys(OrderschemaObject);
module.exports.productFieldsRequired = Object.keys(productType);
module.exports.clientsFieldsRequired = Object.keys(clientType);

module.exports.default = mongoose.model("Order", Orderschema);
