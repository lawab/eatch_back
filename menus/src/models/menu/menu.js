const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");

const restaurantSchemaObject = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: { type: String },
  infos: {
    town: { type: String },
    address: { type: String },
    logo: { type: String, default: "/datas/avatar.png" },
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
    _id: { type: mongoose.Types.ObjectId, required: true },
    title: { type: String },
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
};
const userSchemaObject = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  username: {
    type: String,
  },
  email: {
    type: String,
    validate: {
      validator: function (email) {
        return isEmail(this.email);
      },
    },
  },
};
const menuSchemaObject = {
  restaurant: {
    required: true,
    type: restaurantSchemaObject,
  },
  products: {
    required: true,
    type: [{ type: productType }],
  },
  _creator: { required: true, type: userSchemaObject },
  description: { type: String, minlength: 1, default: "description" },
  menu_title: { type: String, minlength: 1, required: true },
  image: { type: String, default: "/datas/avatar.png" },
  deletedAt: { type: Date, default: null },
};
const fieldsRequired = Object.keys(menuSchemaObject);
const menuSchema = new Schema(menuSchemaObject, { timestamps: true });

module.exports.fieldsRequired = fieldsRequired;
module.exports.Menu = mongoose.model("Menu", menuSchema);
