const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderStatus = require("./orderStatus");
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
const productType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  pusharePrice: {
    type: Number,
  },
  costPrice: {
    type: Number,
  },
  sellingPrice: {
    type: Number,
  },
  productName: {
    type: String,
    maxlength: 50,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      title: { type: String },
      _creator: {
        _id: { type: String },
        role: { type: String },
        email: { type: String },
        firstName: { type: String },
        lastName: { type: String },
      },
      restaurant: {
        _id: { type: String },
        restaurant_name: { type: String },
        logo: { type: String },
      },
    },
  },
  promotion: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  devise: {
    type: String,
    default: "MAD",
  },
  image: {
    type: String,
    default: "/datas/avatar.png",
  },
  liked: {
    type: Number,
    default: 0,
  },

  likedPersonCount: {
    type: Number,
    default: 0,
  },
};
const restaurantType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: { type: String },
  infos: {
    town: { type: String },
    address: { type: String },
    logo: { type: String },
  },
};
const menuType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  menu_title: { type: String },
  restaurant: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      restaurant_name: String,
      infos: {
        town: { type: String },
        address: { type: String },
        logo: { type: String, default: "/datas/avatar.png" },
      },
    },
  },
  price: { type: Number, required: true },
  devise: {
    type: String,
    default: "MAD",
  },
  products: {
    required: true,
    type: [{ type: productType }],
  },
  _creator: {
    type: mongoose.Types.ObjectId,
  },
  description: { type: String, minlength: 1, default: "description" },
  image: { type: String, default: "/datas/avatar.png" },
  deletedAt: { type: Date, default: null },
};
const orderType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  order_title: {
    type: String,
    default: null,
  },
  restaurant: {
    type: restaurantType,
  },
  client: {
    required: true,
    type: clientType,
  },
  products: {
    type: [{ type: productType }],
    validator(products) {
      let invalidProducts = products.filter((el) => !el._id);

      return invalidProducts.lenght > 0;
    },
  },
  menus: {
    type: [menuType],
    validator(menus) {
      let invalidMenus = menus.filter((el) => !el._id);

      return invalidMenus.lenght > 0;
    },
  },
  is_tracking: { type: Boolean, default: false },
  status: {
    type: String,
    enum: [
      orderStatus.DONE,
      orderStatus.TREATMENT,
      orderStatus.PAID,
      orderStatus.WAITED,
    ],
    default: orderStatus.WAITED,
  },
};
const invoiceSchemaObject = {
  order: { required: true, type: orderType },
  restaurant: {
    required: true,
    type: restaurantType,
  },
  _creator: { type: mongoose.Types.ObjectId, required: true },
  devise: { type: String, default: "MAD" },
  image: { type: String, default: "/datas/avatar.png" },
  total: { type: Number, default: 0 },
  deletedAt: { type: Date, default: null },
};
const fieldsRequired = Object.keys(invoiceSchemaObject);
const invoiceSchema = new Schema(invoiceSchemaObject, { timestamps: true });

module.exports.fieldsRequired = fieldsRequired;
module.exports.Invoice = mongoose.model("Invoice", invoiceSchema);
