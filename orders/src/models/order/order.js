const mongoose = require("mongoose");
const status = require("./status");
const Schema = mongoose.Schema;
const productType = {
  _id: { type: mongoose.Types.ObjectId},
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
    _id: { type: mongoose.Types.ObjectId },
    title: { type: String },
    image: { type: String },
    description: { type: String },
    engredients: {
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
  orderQte: { type : Number, default : 0},
  price: {
    type: Number
  },
  category: {
    type: {
      _id: { type: mongoose.Types.ObjectId},
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
  _id: { type: mongoose.Types.ObjectId},
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
  _id: { type: mongoose.Types.ObjectId},
  menu_title: { type: String },
  orderQte: { type: Number, default: 0 },
  restaurant: {
    type: {
      _id: { type: mongoose.Types.ObjectId },
      restaurant_name: String,
      infos: {
        town: { type: String },
        address: { type: String },
        logo: { type: String, default: "/datas/avatar.png" },
      },
    },
  },
  price: { type: Number},
  devise: {
    type: String,
    default: "MAD",
  },
  products: {
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
  total_cost: { type: Number },
  numTablette: { type: Number },
  numOrder: { type: Number },
  is_tracking: { type: Boolean, default: false },
  client: { type: clientType },
  restaurant: {
    type: {
      _id: { type: mongoose.Types.ObjectId },
      restaurant_name: String,
      infos: {
        town: { type: String },
        address: { type: String },
        logo: { type: String, default: "/datas/avatar.png" },
      },
    },
  },
  menus: {
    type: [{ type: menuType }],
    // validator(menus) {
    //   return menus.filter((el) => !el._id).lenght > 0;
    // },
  },
  products: {
    type: [{ type: productType }],
    // validator(products) {
    //   return products.filter((el) => !el._id).lenght > 0;
    // },
  },
  status: {
    type: String,
    enum: [status.DONE, status.TREATMENT, status.PAID, status.WAITED],
    default: status.WAITED,
  },
  deletedAt: { type: Date, default: null },
};
const Orderschema = new Schema(OrderschemaObject, { timestamps: true });

// module.exports.fieldsRequired = Object.keys(OrderschemaObject);
// module.exports.productFieldsRequired = Object.keys(productType);
// module.exports.clientsFieldsRequired = Object.keys(clientType);

module.exports.default = mongoose.model("Order", Orderschema);
