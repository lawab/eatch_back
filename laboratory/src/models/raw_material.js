const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Raw Schema Object
const RawSchemaObject = {
  title: { type: String, require: true, maxlength: 50 },
  available: { type: Number, require: true },
  unit: { type: String, require: true, maxlength: 10 },
  image: { type: String, default: "/datas/avatar.png" },
  _creator: {
    _id: { type: String },
    role: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  },
  laboratory: { type: Schema.ObjectId, ref: "Laboratory", required: true },
  provider: { type: mongoose.Types.ObjectId, ref: "Provider" },
  deletedAt: { type: Date, default: null },
};

//Instance of Schema
const RawSchema = new Schema(RawSchemaObject, { timestamps: true });

module.exports = mongoose.model("Raw", RawSchema);
