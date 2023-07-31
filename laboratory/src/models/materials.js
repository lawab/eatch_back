const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Material Schema Object
const MaterialSchemaObject = {
  title: { type: String, require: true, maxlength: 50 },
  quantity: { type: Number, require: true },
  unit: { type: String, require: true, maxlength: 10 },
  lifetime: { type: Date },
  image: { type: String, default: "/datas/avatar.png" },
  // _creator: {
  //   _id: { type: String },
  //   role: { type: String },
  //   email: { type: String },
  //   firstName: { type: String },
  //   lastName: { type: String },
  // },
  _creator: {
    type: mongoose.Types.ObjectId,
  },
  laboratory: { type: Schema.ObjectId, ref: "Laboratory", required: true },
  deletedAt: { type: Date, default: null },
};

//Instance of Schema
const MaterialSchema = new Schema(MaterialSchemaObject, { timestamps: true });

module.exports = mongoose.model("Material", MaterialSchema);
