const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Provider Schema Object
const ProviderSchemaObject = {
  firstName: { type: String, require: true, maxlength: 50 },
  lastName: { type: String, maxlength: 50 },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  adresse: { type: String},
  image: { type: String, default: "/datas/avatar.png" },
  _creator: {
    _id: { type: String },
    role: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  },
  laboratory: { type: Schema.ObjectId, ref: "Laboratory", required: true },
  deletedAt: { type: Date, default: null },
};

//Instance of Schema
const ProviderSchema = new Schema(ProviderSchemaObject, { timestamps: true });

module.exports = mongoose.model("Provider", ProviderSchema);
