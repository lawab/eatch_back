const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchemaObject = {
  value: { type: String, required: true, unique: true },
  _creator: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
  deletedAt: { type: Date, default: null },
};
const EmployerSchema = new Schema(RoleSchemaObject, {
  timestamps: true,
});

module.exports.default = mongoose.model("Role", EmployerSchema);
module.exports.fieldsRequired = Object.keys(RoleSchemaObject);
