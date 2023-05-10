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

const dynamicTypeRequired = {
  name: { type: String, unique: true },
  price: { type: Number },
  devise: { type: String, default: "MAD" },
  quantity: { type: Number, default: 1 },
};

const logisticSchemaObject = {
  restaurant: {
    required: true,
    type: restaurantSchemaObject,
  },
  _creator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  deletedAt: { type: Date, default: null },
};

const logisticSchema = new Schema(logisticSchemaObject, { timestamps: true });

module.exports.fieldsRequired = Object.keys(logisticSchemaObject);
module.exports.dynamicTypeRequired = dynamicTypeRequired;
module.exports.logisticSchema = logisticSchema;
module.exports.Logistic = mongoose.model("Logistic", logisticSchema);
