const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployerSchemaObject = {
  fonction: { type: String, required: true, unique: true },
  mission: { type: String },
  _creator: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
  deletedAt: { type: Date, default: null },
};
const EmployerSchema = new Schema(EmployerSchemaObject, {
  timestamps: true,
});

module.exports.default = mongoose.model("EmployerType", EmployerSchema);
module.exports.fieldsRequired = Object.keys(EmployerSchemaObject);
