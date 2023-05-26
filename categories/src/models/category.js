const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Category Schema Object
const CategorySchemaObject = {
  title: { type: String, unique: true, require: true, maxlength: 50 },
  image: { type: String, default: "/datas/avatar.png" },
  // products: {
  //     type:[ {type: mongoose.SchemaTypes.ObjectId} ],
  //     default: []
  // }
  products: {
    type: [
      {
        _id: { type: String },
        price: { type: Number },
        productName: { type: String, maxlength: 50 },
        quantity: { type: Number, default: 0 },
        promotion: { type: Boolean, default: false },
        description: { type: String },
        devise: { type: String, default: "MAD" },
        cookingtime: { type: String },
        image: { type: String, default: "/data/uploads/mcf.png" },
        liked: { type: Number, default: 0 },
        likedPersonCount: { type: Number, default: 0 },
        pusharePrice: { type: Number },
        costPrice: { type: Number },
        sellingPrice: { type: Number },
      },
    ],
  },
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
