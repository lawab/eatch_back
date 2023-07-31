const mongoose = require("mongoose");
const restaurantSchemaObject = {
  restaurant_name: { type: String, maxlength: 50 },
  infos: {
    town: { type: String },
    address: { type: String },
    logo: { type: String },
  },

  deletedAt: { type: Date, default: null },
};
const materialType = {
  _id: { type: String },
  restaurant: {
    type: restaurantSchemaObject,
  },
  lifetime: {
    type: Date,
  },
  mp_name: { type: String },
  quantity: { type: Number },
  min_quantity: { type: Number },
};
const rawType = {
  _id: { type: String },
  title: { type: String },
  quantity: { type: Number },
  unit: { type: String },
  lifetime: { type: Date },
  image: { type: String },
  _creator: {
    _id: { type: String },
    role: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  },
  laboratory: {
    type: mongoose.Types.ObjectId,
  },
};

const recetteSchemaObject = {
  title: { type: String, required: true, maxlength: 50 },
  restaurant: { type: String},
  image: { type: String, default: "/datas/avatar.png" },
  description: { type: String, required: true, maxlength: 50 },
  engredients: {
    required: true,
    type: [
      {
        material: {
          ...materialType,
          grammage: { type: Number },
          unity: { type: String },
        },
        raw_material: {
          ...rawType,
          grammage: { type: Number },
          unity: { type: String },
        },
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
