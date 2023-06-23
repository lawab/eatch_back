const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Category Schema Object
const CategorySchemaObject = {
  title: { type: String, unique: true, require: true, maxlength: 50 },
  image: { type: String, default: "/datas/avatar.png" },
  _creator: {
    _id: { type: String },
    role: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  },
  restaurant: {
    _id: { type: String, required: true },
    restaurant_name: { type: String },
    logo: { type: String },
  },
  deletedAt: { type: Date, default: null },
};

//Instance of Schema
const CategorySchema = new Schema(CategorySchemaObject, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);
