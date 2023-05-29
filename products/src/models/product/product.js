const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Custum schema Object from foreign fields in product model
const materialType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  mp_name: { type: String, maxlength: 50 },
  quantity: { type: Number, default: 0 },
  lifetime: {
    type: Date,
  },
};
const commentType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  client: {
    firstName: String,
    lastName: String,
    phone_number: String,
  },
};

const restaurantType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: String,
  infos: {
    town: String,
    address: String,
    logo: String,
  },
};

const categoryType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  title: String,
  image: String,
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
  deletedAt: { type: Date, default: null },
};

const recetteType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  title: { type: String },
  image: { type: String },
  description: { type: String },
  engredients: [
    {
      material: { type: mongoose.Types.ObjectId },
      grammage: { type: Number },
    },
  ],
  _creator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  deletedAt: { type: Date, default: null },
};

// Product schema Object
const productSchemaObject = {
  comments: {
    type: [commentType],
  },
  recettes: {
    required: true,
    type: [recetteType],
  },
  restaurant: {
    required: true,
    type: restaurantType,
  },
  category: {
    required: true,
    type: categoryType,
  },
  price: {
    type: Number,
    required: true,
  },
  _creator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  productName: {
    type: String,
    required: true,
    maxlength: 50,
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
    default: false,
  },
  description: {
    type: String,
  },
  devise: {
    type: String,
    default: "MAD",
  },
  cookingtime: {
    type: String,
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
  deletedAt: { type: Date, default: null },
};

const productSchema = new Schema(productSchemaObject, { timestamps: true });

module.exports.fieldsRequired = Object.keys(productSchemaObject);
module.exports.Product = mongoose.model("Product", productSchema);
