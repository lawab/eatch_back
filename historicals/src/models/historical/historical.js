const mongoose = require("mongoose");
const { orderStatus, actionTypes } = require("../statusTypes");
const Schema = mongoose.Schema;
const roles = require("../roles");
const { isEmail } = require("validator");

// users type
const userType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      restaurant_name: { type: String },
      infos: {
        town: { type: String },
        address: { type: String },
        logo: { type: String, default: "/datas/avatar.png" },
      },
    },
  },
  laboratory: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      labo_name: { type: String, required: true, maxlength: 50 },
      address: { type: String, required: true, maxlength: 50 },
      email: {
        type: String,
      },
      materials: [
        {
          material: { type: String, require: false, maxlength: 50 },
          mp_name: { type: String, require: false, maxlength: 50 },
          stock: { type: Number, require: false, maxlength: 50 },
        },
      ],

      providers: [
        {
          owner: { type: Object },
          restaurant: { type: Object },
          material: { type: Object },
          grammage: { type: Number, require: false },
          date_provider: { type: Date, require: false },
        },
      ],

      _creator: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      deletedAt: { type: Date, default: null },
    },
  },
  password: {
    type: String,
  },
  firstName: {
    type: String,
    maxlength: 50,
  },
  lastName: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    validate: {
      validator: function (email) {
        return isEmail(email);
      },
    },
  },
  username: {
    type: String,
  },
  role: {
    type: String,
  },
  avatar: {
    type: String,
    default: "/data/uploads/mcf.png",
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  _creator: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  deletedAt: { type: Date, default: null },
};

// material type
const materialType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      restaurant_name: { type: String },
      infos: {
        town: { type: String },
        address: { type: String },
        logo: { type: String, default: "/datas/avatar.png" },
      },
    },
  },
  _creator: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  lifetime: {
    type: Date,
    default: Date.now,
  },
  mp_name: { type: String },
  quantity: { type: Number, default: 0 },
  min_quantity: { type: Number, default: 0 },
  deletedAt: { type: Date, default: null },
};
// product type
const productType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  comments: {
    type: [
      {
        _id: { type: mongoose.Types.ObjectId, required: true },
        client: {
          type: {
            firstName: { type: String },
            lastName: { type: String },
            phone_number: String,
          },
        },
      },
    ],
  },
  recette: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      title: { type: String },
      image: { type: String },
      description: { type: String },
      engredients: [
        {
          material: { type: mongoose.Types.ObjectId },
          grammage: { type: Number },
        },
      ],
      deletedAt: { type: Date, default: null },
    },
  },
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      restaurant_name: { type: String },
      infos: {
        town: { type: String },
        address: { type: String },
        logo: { type: String, default: "/datas/avatar.png" },
      },
    },
  },
  category: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      title: { type: String },
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
      deletedAt: { type: Date, default: null },
    },
  },
  price: {
    type: Number,
    required: true,
  },
  _creator: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  productName: {
    type: String,
    maxlength: 50,
    required: true,
  },

  pusharePrice: {
    type: Number,
  },
  costPrice: {
    type: Number,
  },
  sellingPrice: {
    type: Number,
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
  },
  cookingtime: {
    type: String,
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
  deletedAt: { type: Date, default: null },
};

// orders type
const OrderType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  order_title: {
    type: String,
    default: null,
  },
  is_tracking: { type: Boolean, default: false },
  client: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      firstName: {
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
    },
  },
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      restaurant_name: { type: String },
      infos: {
        town: { type: String },
        address: { type: String },
        logo: { type: String, default: "/datas/avatar.png" },
      },
    },
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  products: {
    type: [
      {
        type: {
          _id: { type: mongoose.Types.ObjectId, required: true },
          recette: {
            type: {
              _id: { type: mongoose.Types.ObjectId, required: true },
              title: { type: String },
              image: { type: String },
              description: { type: String },
              engredients: [
                {
                  material: { type: mongoose.Types.ObjectId },
                  grammage: { type: Number },
                },
              ],
              _creator: {
                type: mongoose.Types.ObjectId,
              },
              deletedAt: { type: Date, default: null },
            },
          },
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

          price: {
            type: Number,
          },
          category: {
            type: {
              _id: { type: mongoose.Types.ObjectId, required: true },
              title: { type: String },
            },
            required: true,
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
            default: "/data/uploads/mcf.png",
          },
          liked: {
            type: Number,
            default: 0,
          },

          likedPersonCount: {
            type: Number,
            default: 0,
          },
        },
      },
    ],
  },
  menus: {
    type: [
      {
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
      },
    ],
  },
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
  deletedAt: { type: Date, default: null },
};

const restaurantType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: { type: String },
  infos: {
    town: { type: String },
    address: { type: String },
    logo: { type: String, default: "/datas/avatar.png" },
  },
  _creator: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  deletedAt: { type: Date, default: null },
};

// menu type
const menuType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      restaurant_name: { type: String },
      infos: {
        town: { type: String },
        address: { type: String },
        logo: { type: String },
      },
    },
  },
  products: {
    required: true,
    type: [
      {
        _id: { type: mongoose.Types.ObjectId, required: true },
        pusharePrice: {
          type: Number,
        },
        recette: {
          required: true,
          type: {
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
            deletedAt: { type: Date, default: null },
          },
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
            deletedAt: { type: Date, default: null },
          },
          required: true,
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
        },
        image: {
          type: String,
        },
        deletedAt: { type: Date, default: null },
      },
    ],
  },
  description: { type: String, minlength: 1, default: "description" },
  menu_title: { type: String, minlength: 1, required: true },
  image: { type: String },
  _creator: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  deletedAt: { type: Date, default: null },
};

// invoice type

const invoiceType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      restaurant_name: { type: String, required: true },
      infos: {
        town: { type: String, required: true },
        address: { type: String, required: true },
        logo: { type: String, default: "/datas/avatar.png" },
      },
    },
  },
  order: {
    required: true,
    type: {
      order_title: {
        type: String,
        default: null,
      },
      restaurant: {
        required: true,
        type: {
          _id: { type: mongoose.Types.ObjectId, required: true },
          restaurant_name: { type: String, required: true },
          infos: {
            town: { type: String, required: true },
            address: { type: String, required: true },
            logo: {
              type: String,
              default: "/datas/avatar.png",
            },
          },
        },
      },
      client: {
        required: true,
        type: {
          _id: { type: mongoose.Types.ObjectId, required: true },
          firstName: {
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
        },
      },
      products: {
        required: true,
        type: [
          {
            type: {
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
              quantity: {
                type: Number,
                required: true,
                default: 0,
              },
              price: {
                type: Number,
                required: true,
              },
              category: {
                type: {
                  _id: { type: mongoose.Types.ObjectId, required: true },
                  title: { type: String },
                },
                required: true,
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
                default: "/data/uploads/mcf.png",
              },
              liked: {
                type: Number,
                default: 0,
              },

              likedPersonCount: {
                type: Number,
                default: 0,
              },
            },
          },
        ],
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
    },
  },
  _creator: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  devise: { type: String, default: "MAD" },
  total: { type: Number, default: 0 },
  deletedAt: { type: Date, default: null },
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

// promotion type
const promotionType = {
  promotion_name: { type: String, required: true },
  clients: {
    type: [
      {
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
      },
    ],
  },
  end_date: { type: Date, required: false, default: null }, //must remove default value for production
  percent: { type: Number, default: 0 },
  product: {
    type: {
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
      price: {
        type: Number,
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
    },
  },
  menu: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      price: { type: Number, required: true },
      devise: {
        type: String,
      },
      products: {
        required: true,
        type: [
          {
            type: {
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
              price: {
                type: Number,
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
            },
          },
        ],
        validate: {
          validator(products = []) {
            return products.length > 0 ? true : false;
          },
        },
      },
      _creator: { required: true, type: mongoose.Types.ObjectId },
      description: { type: String, minlength: 1, default: "description" },
      menu_title: { type: String, minlength: 1, required: true },
      image: { type: String, default: "/datas/avatar.png" },
      deletedAt: { type: Date, default: null },
    },
  },
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      restaurant_name: { type: String, required: true },
      infos: {
        town: { type: String, required: true },
        address: { type: String, required: true },
        logo: { type: String, default: "/datas/avatar.png" },
      },
    },
  },
  image: { type: String, default: "/datas/avatar.png" },
  _creator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  deletedAt: { type: Date, default: null },
};

// logistic type
const logisticType = {
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, reuired: true },
      restaurant_name: { type: String },
      infos: {
        town: { type: String },
        address: { type: String },
        logo: String,
      },
    },
  },
  image: { type: String, default: "/datas/avatar.png" },
  name: { type: String },
  price: { type: Number },
  devise: { type: String, default: "MAD" },
  quantity: { type: Number, default: 1 },
  _creator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  deletedAt: { type: Date, default: null },
};

const categeryType = {
  _id: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String },
  restaurant: {
    _id: { type: String, required: true },
    restaurant_name: { type: String },
    logo: { type: String },
  },
  _creator: {
    _id: { type: String },
    role: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  deletedAt: { type: Date, default: null },
};

const recetteType = {
  _id: { type: mongoose.Types.ObjectId, required: true },

  title: { type: String },
  image: { type: String, default: "/datas/avatar.png" },
  description: { type: String },
  engredients: [
    {
      material: { type: materialType },
      grammage: { type: Number },
    },
  ],
  _creator: {
    type: mongoose.Types.ObjectId,
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },

  deletedAt: { type: Date, default: null },
};

// historical type
const hIstoricalSchemaObject = {
  users: {
    type: [{ type: userType }],
  },
  products: {
    type: [{ type: productType }],
  },
  materials: {
    type: [{ type: materialType }],
  },
  orders: {
    type: [{ type: OrderType }],
  },
  restaurants: {
    type: [{ type: restaurantType }],
  },
  menus: {
    type: [{ type: menuType }],
  },
  invoices: {
    type: [{ type: invoiceType }],
  },
  promotions: {
    type: [{ type: promotionType }],
  },
  logistics: {
    type: [{ type: logisticType }],
  },
  categories: {
    type: [{ type: categeryType }],
  },
  recettes: {
    type: [{ type: recetteType }],
  },
  deletedAt: { type: Date, default: null },
};

const hIstoricalSchema = new Schema(hIstoricalSchemaObject, {
  timestamps: true,
});

module.exports.fieldsRequired = Object.keys(hIstoricalSchemaObject);
module.exports.HIstorical = mongoose.model("HIstorical", hIstoricalSchema);
