const mongoose = require("mongoose");
const { isEmail } = require("validator");
const restaurantType = {
  restaurant_name: { type: String, required: true, maxlength: 50 },
  infos: {
    town: { type: String, required: true },
    adress: { type: String, required: true },
    logo: { type: String, default: "/datas/avatar.png" },
  },

  deletedAt: { type: Date, default: null },
};
const materialType = {
  restaurant: {
    required: true,
    type: Object,
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
const laboSchema = new mongoose.Schema(
  {
    labo_name: { type: String, required: true, maxlength: 50 },
    address: { type: String, required: true, maxlength: 50 },
    image: { type: String },
    email: {
      type: String,
      // unique: true,
      // validate: {
      //   validator: function (V) {
      //     return isEmail(V);
      //   },
      // },
    },
    raws: { type: [{ type: mongoose.Types.ObjectId, ref: "Raw" }] },
    providers: { type: [{ type: mongoose.Types.ObjectId, ref: "Provider" }] },
    materials: { type: [{ type: mongoose.Types.ObjectId, ref: "Material" }] },

    providings: [
      {
        provider: { type: mongoose.Types.ObjectId, ref: "Provider" },
        raw: { type: mongoose.Types.ObjectId, ref: "Raw" },
        grammage: { type: Number, require: false },
        date_provider: { type: Date, require: false },
      },
    ],

    manufacturings: [
      {
        material: { type: mongoose.Types.ObjectId, ref: "Material" },
        qte: { type: Number, require: false },
        date_manufactured: { type: Date, require: false },
      },
    ],

    requestMaterials: [
      {
        requestId: { type: mongoose.Types.ObjectId },
        material: { type: Object },
        restaurant: { type: Object },
        qte: { type: Number, require: false },
        date_providing: { type: Date, require: false },
        validated: { type: Boolean, default: false },
        date_validated: { type: Date, require: false },
      },
    ],

    _creator: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Laboratory", laboSchema);
