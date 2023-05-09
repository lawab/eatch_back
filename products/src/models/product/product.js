const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Custum schema Object from foreign fields in product model
const materialSchemaObject = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  mp_name: { required: true, type: String, maxlength: 50 },
  quantity: { type: Number, default: 0, required: true },
  lifetime: {
    required: true,
    type: Date,
  },
};
const commentSchemaObject = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  client: {
    type: {
      firstName: { type: String, maxlength: 50 },
      lastName: { type: String, maxlength: 50 },
      phone_number: String,
    },
  },
};

const restaurantSchemaObject = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  infos: {
    type: {
      town: { type: String, required: true },
      address: { type: String, required: true },
      restaurant_name: { type: String, required: true },
    },
  },
};

const categorySchemaObject = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  category_name: { type: String, maxlength: 50 },
};

// Product schema Object
const productSchemaObject = {
  comments: {
    type: [commentSchemaObject],
  },
  materials: {
    required: true,
    type: [{ type: materialSchemaObject }],
  },
  restaurant: {
    required: true,
    type: restaurantSchemaObject,
  },
  category: {
    required: true,
    type: categorySchemaObject,
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
    maxlength: 50,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
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
  deletedAt: { type: Date, default: null },
};

const productSchema = new Schema(productSchemaObject, { timestamps: true });

module.exports.fieldsRequired = Object.keys(productSchemaObject);
module.exports.Product = mongoose.model("Product", productSchema);
