const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
const materialObject = {
  restaurant: {
    required: true,
    type: restaurantSchemaObject,
  },
  _creator: { type: mongoose.Types.ObjectId, required: true },
  lifetime: {
    required: true,
    type: Date,
    default: Date.now,
  },
  image: { type: String },
  mp_name: { required: true, type: String, maxlength: 50 },
  quantity: { type: Number, default: 0, required: true },
  consumer_quantity: { type: Number, default: 0 },
  current_quantity: { type: Number, default: 0 },
  deletedAt: { type: Date, default: null },
  unity: {
    type: String,
    default: "g",
  },
};
const fieldsRequired = Object.keys(materialObject);
const materialSchema = new Schema(materialObject, { timestamps: true });

module.exports.fieldsRequired = fieldsRequired;
module.exports.Material = mongoose.model("Material", materialSchema);