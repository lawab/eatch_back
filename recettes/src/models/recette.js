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
const recetteSchemaObject = {
  title: { type: String, required: true, maxlength: 50 },
  image: { type: String, default: "/datas/avatar.png" },
  description: { type: String, required: true, maxlength: 50 },
  engredients: {
    required: true,
    type: [
      {
        material: { type: materialType },
        grammage: { type: Number },
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
