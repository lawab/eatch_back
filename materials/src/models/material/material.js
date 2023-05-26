const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: { type: String },
  infos: {
    town: { type: String },
    address: { type: String },
    logo: { type: String, default: "/datas/avatar.png" },
  },
};
const materialObject = {
  restaurant: {
    required: true,
    type: restaurantType,
  },
  _creator: { type: mongoose.Types.ObjectId, required: true },
  lifetime: {
    required: true,
    type: Date,
    default: null,
  },
  image: { type: String, default: "/datas/avatar.png" },
  mp_name: { required: true, type: String, maxlength: 50 },
  quantity: { type: Number, default: 0, required: true },
  consumer_quantity: { type: Number, default: 0 },
  current_quantity: { type: Number, default: 0 },
  unity: {
    type: String,
    default: "g",
  },
  deletedAt: { type: Date, default: null },
};
const fieldsRequired = Object.keys(materialObject);
const materialSchema = new Schema(materialObject, { timestamps: true });

module.exports.fieldsRequired = fieldsRequired;
module.exports.Material = mongoose.model("Material", materialSchema);
