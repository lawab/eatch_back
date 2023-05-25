const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Custum schema Object from foreign fields in product model
const materialSchemaObject = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  mp_name: { type: String, maxlength: 50 },
  quantity: { type: Number, default: 0 },
  lifetime: {
    type: Date,
  },
};
const commentSchemaObject = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  client: {
    firstName: String,
    lastName: String,
    phone_number: String,
  },
};

const restaurantSchemaObject = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: String,
  infos: {
    town: String,
    address: String,
    logo: String,
  },
};

const categorySchemaObject = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  title: String,
  image: String,
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
    required: true,
    maxlength: 50,
  },
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator(v) {
        return v >= 0;
      },
    },
    default: 0,
    min: 0,
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
