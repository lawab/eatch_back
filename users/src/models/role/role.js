const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: String,
  infos: {
    town: String,
    address: String,
    logo: String,
  },
};

const RoleSchemaObject = {
  value: { type: String, required: true },
  _creator: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
  restaurant: { type: restaurantType, required: true },
  deletedAt: { type: Date, default: null },
};

const RoleSchema = new Schema(RoleSchemaObject, {
  timestamps: true,
});

module.exports.default = mongoose.model("Role", RoleSchema);
module.exports.fieldsRequired = Object.keys(RoleSchemaObject);
