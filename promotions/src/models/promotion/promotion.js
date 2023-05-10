const mongoose = require("mongoose");
const orderstatus = require("../orderstatus");
const Schema = mongoose.Schema;

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

const OrderType = {
  order_title: {
    type: String,
    default: null,
  },
  is_tracking: { type: Boolean, default: false },
  client: { type: clientType, required: true },
  restaurant: {
    required: true,
    type: restaurantType,
  },
  products: {
    required: true,
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

const promotionSchemaObject = {
  promotion_name: { type: String, required: true },
  clients: { type: [{ type: clientType }] },
  lifetime: { type: Date, required: true },
  order: { type: OrderType, required: true },
  restaurant: {
    required: true,
    type: restaurantType,
  },
  _creator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  deletedAt: { type: Date, default: null },
};

const promotionSchema = new Schema(promotionSchemaObject, { timestamps: true });

module.exports.fieldsRequired = Object.keys(promotionSchemaObject);
module.exports.Promotion = mongoose.model("Promotion", promotionSchema);
