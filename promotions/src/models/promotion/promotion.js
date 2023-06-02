const mongoose = require("mongoose");
const orderstatus = require("../orderstatus");
const Schema = mongoose.Schema;

const restaurantType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: String,
  infos: {
    town: String,
    address: String,
    logo: { type: String, default: "/datas/avatar.png" },
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
  },
  price: {
    type: Number,
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
const OrderType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  order_title: {
    type: String,
    default: null,
  },
  is_tracking: { type: Boolean, default: false },
  client: { type: clientType },
  restaurant: {
    type: restaurantType,
  },
  products: {
    type: [{ type: productType }],
  },
  status: {
    type: String,
    enum: [
      orderstatus.DONE,
      orderstatus.TREATMENT,
      orderstatus.PAID,
      orderstatus.WAITED,
    ],
    default: orderstatus.WAITED,
  },
  deletedAt: { type: Date, default: null },
};

const promotionSchemaObject = {
  promotion_name: { type: String, required: true },
  clients: { type: [clientType] },
  end_date: { type: Date, required: false, default: null }, //must remove default value for production
  order: { type: OrderType, required: true },
  restaurant: {
    required: true,
    type: restaurantType,
  },
  image: { type: String, default: "/datas/avatar.png" },
  _creator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  deletedAt: { type: Date, default: null },
};

const promotionSchema = new Schema(promotionSchemaObject, { timestamps: true });

module.exports.fieldsRequired = Object.keys(promotionSchemaObject);
module.exports.Promotion = mongoose.model("Promotion", promotionSchema);
