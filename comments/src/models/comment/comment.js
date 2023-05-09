const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const clientType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  fisrtName: {
    type: String,
    maxlenght: 50,
    default: null,
  },
  lastName: {
    type: String,
    maxlenght: 50,
    default: null,
  },
  isOnline: { type: Boolean, default: false },
  phoneNumber: {
    type: String,
    maxlenght: 50,
    default: null,
  },
};
const commentSchemaObject = {
  client: {
    required: true,
    type: clientType,
  },
  message: { type: String, required: true, minlength: 1 },
  deletedAt: { type: Date, default: null },
};

const commentSchema = new Schema(commentSchemaObject, { timestamps: true });

module.exports.fieldsRequired = Object.keys(commentSchemaObject);
module.exports.Comment = mongoose.model("Comment", commentSchema);
