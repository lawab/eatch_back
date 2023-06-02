const mongoose = require("mongoose");
const status = require("./status");
const Schema = mongoose.Schema;
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
  },
  recette: {
    _id: { type: mongoose.Types.ObjectId, required: true },
    title: { type: String },
    image: { type: String },
    description: { type: String },
    engredients: {
      required: true,
      type: [
        {
          material: { type: mongoose.Types.ObjectId },
          grammage: { type: Number },
        },
      ],
    },
    _creator: {
      type: mongoose.Types.ObjectId,
    },
    deletedAt: { type: Date, default: null },
  },

  price: {
    type: Number,
    required: true,
  },
  category: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      title: String,
      image: String,
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

const OrderschemaObject = {
  order_title: {
    type: String,
    default: null,
  },
  is_tracking: { type: Boolean, default: false },
  client: { type: clientType, required: true },
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      restaurant_name: String,
      infos: {
        town: { type: String, required: true },
        address: { type: String, required: true },
        logo: { type: String, default: "/datas/avatar.png" },
      },
    },
  },
  menus: {
    type: [menuType],
    validator(menus) {
      let invalidMenus = menus.filter((el) => !el._id);

      return invalidMenus.lenght > 0;
    },
  },
  products: {
    required: true,
    type: [{ type: productType }],
    validator(products) {
      let invalidProducts = products.filter((el) => !el._id);

      return invalidProducts.lenght > 0;
    },
  },
  status: {
    type: String,
    enum: [status.DONE, status.TREATMENT, status.PAID, status.WAITED],
    default: status.WAITED,
  },
  deletedAt: { type: Date, default: null },
};
const Orderschema = new Schema(OrderschemaObject, { timestamps: true });

module.exports.fieldsRequired = Object.keys(OrderschemaObject);
module.exports.productFieldsRequired = Object.keys(productType);
module.exports.clientsFieldsRequired = Object.keys(clientType);

module.exports.default = mongoose.model("Order", Orderschema);
