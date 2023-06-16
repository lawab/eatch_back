const mongoose = require("mongoose");
const restaurantSchemaObject = {
  restaurant_name: { type: String, required: true, maxlength: 50 },
  infos: {
    town: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String, default: "/datas/avatar.png" },
  },

  deletedAt: { type: Date, default: null },
};
const materialType = {
  restaurant: {
    required: true,
    type: restaurantSchemaObject,
  },

  lifetime: {
    required: true,
    type: Date,
    default: Date.now,
  },
  mp_name: { required: true, type: String, maxlength: 50 },
  quantity: { type: Number, default: 0, required: true },
  min_quantity: { type: Number, default: 0 },
  deletedAt: { type: Date, default: null },
};
const rawType = {
  _id: { type: String },
  title: { type: String, require: true, maxlength: 50 },
  grammage: { type: Number, require: true },
  image: { type: String, default: "/datas/avatar.png" },
  _creator: {
    _id: { type: String },
    role: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  },
  laboratory: {
    type: mongoose.Types.ObjectId,
    ref: "Laboratory",
    required: true,
  },
  deletedAt: { type: Date, default: null },
};

const recetteSchemaObject = {
  title: { type: String, required: true, maxlength: 50 },
  image: { type: String, default: "/datas/avatar.png" },
  description: { type: String, required: true, maxlength: 50 },
  engredients: {
    required: true,
    type: [
      {
        material: { type: materialType },
        raw_material: { type: rawType },
        grammage: { type: Number },
        unity: { type: String, default: "g" },
      },
    ],
  },

  _creator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  deletedAt: { type: Date, default: null },
};

const recetteSchema = new mongoose.Schema(recetteSchemaObject, {
  timestamps: true,
});

module.exports = mongoose.model("Recette", recetteSchema);
module.exports.fieldsRequired = Object.keys(recetteSchemaObject);
