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
    adress: { type: String, required: true, maxlength: 50 },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (V) {
          return isEmail(V);
        },
      },
      maxlength: 50,
    },
    materials: [
      {
        material: { type: String, require: false, maxlength: 50 },
        mp_name: { type: String, require: false, maxlength: 50 },
        stock: { type: Number, require: false, maxlength: 50 },
      },
    ],

    providers: [
      {
        owner: { type: Object },
        restaurant: { type: Object },
        material: { type: Object },
        grammage: { type: Number, require: false },
        date_provider: { type: Date, require: false },
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
