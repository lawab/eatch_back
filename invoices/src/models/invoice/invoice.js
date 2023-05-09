const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderStatus = require("./orderStatus");
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
const restaurantType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  infos: {
    type: {
      town: { type: String, required: true },
      address: { type: String, required: true },
      restaurant_name: { type: String, required: true },
    },
  },
};
const orderType = {
  order_title: {
    type: String,
    default: null,
  },
  restaurant: {
    required: true,
    type: restaurantType,
  },
  client: {
    required: true,
    type: clientType,
  },
  products: {
    required: true,
    type: [{ type: productType }],
  },
  is_tracking: { type: Boolean, default: false },
  status: {
    type: String,
    enum: [
      orderStatus.DONE,
      orderStatus.TREATMENT,
      orderStatus.PAID,
      orderStatus.WAITED,
    ],
    default: orderStatus.WAITED,
  },
};
const invoiceSchemaObject = {
  order: { required: true, type: orderType },
  _creator: { type: mongoose.Types.ObjectId, required: true },
  devise: { type: String, default: "MAD" },
  total: { type: Number, default: 0 },
  deletedAt: { type: Date, default: null },
};
const fieldsRequired = Object.keys(invoiceSchemaObject);
const invoiceSchema = new Schema(invoiceSchemaObject, { timestamps: true });

module.exports.fieldsRequired = fieldsRequired;
module.exports.Invoice = mongoose.model("Invoice", invoiceSchema);
