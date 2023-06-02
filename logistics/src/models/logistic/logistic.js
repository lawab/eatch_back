const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: { type: String },
  infos: {
    town: String,
    address: String,
    logo: String,
  },
};

const logisticSchemaObject = {
  restaurant: {
    required: true,
    type: restaurantType,
  },
  image: { type: String, default: "/datas/avatar.png" },
  _creator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: { type: String, unique: true },
  price: { type: Number },
  devise: { type: String, default: "MAD" },
  quantity: { type: Number, default: 0 },
  deletedAt: { type: Date, default: null },
};

const logisticSchema = new Schema(logisticSchemaObject, { timestamps: true });

module.exports.fieldsRequired = Object.keys(logisticSchemaObject);
module.exports.logisticSchema = logisticSchema;
module.exports.Logistic = mongoose.model("Logistic", logisticSchema);
