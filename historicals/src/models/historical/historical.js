const mongoose = require("mongoose");
const { orderStatus, actionTypes } = require("../statusTypes");
const Schema = mongoose.Schema;
const roles = require("../roles");
// client type
const clientType = {
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
  _creator: {
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
    },
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
};

// material type
const materialType = {
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      infos: {
        type: {
          town: { type: String, required: true },
          address: { type: String, required: true },
          restaurant_name: { type: String, required: true },
        },
      },
    },
  },
  _creator: {
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
    },
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  lifetime: {
    required: true,
    type: Date,
    default: Date.now,
  },
  mp_name: { required: true, type: String, maxlength: 50 },
  quantity: { type: Number, default: 0, required: true },
  min_quantity: { type: Number, default: 0 },
  deletedAt: { type: Date, default: null },
};
// product type
const productType = {
  comments: {
    type: [
      {
        _id: { type: mongoose.Types.ObjectId, required: true },
        client: {
          type: {
            firstName: { type: String, maxlength: 50 },
            lastName: { type: String, maxlength: 50 },
            phone_number: String,
          },
        },
      },
    ],
  },
  materials: {
    required: true,
    type: [
      {
        _id: { type: mongoose.Types.ObjectId, required: true },
        mp_name: { required: true, type: String, maxlength: 50 },
        quantity: { type: Number, default: 0, required: true },
        lifetime: {
          required: true,
          type: Date,
        },
      },
    ],
  },
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      infos: {
        type: {
          town: { type: String, required: true },
          address: { type: String, required: true },
          restaurant_name: { type: String, required: true },
        },
      },
    },
  },
  category: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      category_name: { type: String, maxlength: 50 },
    },
  },
  price: {
    type: Number,
    required: true,
  },

  _creator: {
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
    },
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
  quantity: {
    type: Number,
    required: true,
    default: 0,
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
    default: "MAD",
  },
  cookingtime: {
    type: String,
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
  deletedAt: { type: Date, default: null },
};

// orders type
const OrderType = {
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
    required: true,
  },
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      infos: {
        type: {
          town: { type: String, required: true },
          address: { type: String, required: true },
          restaurant_name: { type: String, required: true },
        },
      },
    },
  },
  _creator: {
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
    },
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
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
              category_name: { type: String, maxlength: 50 },
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
  restaurant_name: { type: String, require: true, maxlength: 50 },
  info: {
    town: { type: String, require: true },
    address: { type: String, require: true },
    logo: { type: String, require: true },
  },
  _creator: {
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
    },
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  deletedAt: { type: Date, default: null },
};

// users type

const userType = {
  restaurant: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      infos: {
        type: {
          town: { type: String, required: true },
          address: { type: String, required: true },
          restaurant_name: { type: String, required: true },
        },
      },
    },
  },
  firstName: {
    required: true,
    type: String,
    maxlength: 50,
  },
  lastName: {
    required: true,
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    validate: {
      validator: function (email) {
        return validator.isEmail(this.email);
      },
    },
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: roles.SUPER_ADMIN,
    enum: [roles.SUPER_ADMIN, roles.RH, roles.COMPTABLE, roles.MANAGER],
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
    },
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
  restaurant: {
    required: true,
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      infos: {
        type: {
          town: { type: String, required: true },
          address: { type: String, required: true },
          restaurant_name: { type: String, required: true },
        },
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
              category_name: { type: String, maxlength: 50 },
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
  _creator: {
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
    },
  },
  action: {
    type: String,
    required: true,
    enum: [actionTypes.CREATED, actionTypes.UPDATED, actionTypes.DELETED],
  },
  description: { type: String, minlength: 1, default: "description" },
  menu_title: { type: String, minlength: 1, required: true },
  image: { type: String, default: "/data/mcf.png" },
  deletedAt: { type: Date, default: null },
};

// invoice type

const invoiceType = {
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
          infos: {
            type: {
              town: { type: String, required: true },
              address: { type: String, required: true },
              restaurant_name: { type: String, required: true },
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
                  category_name: { type: String, maxlength: 50 },
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
    },
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

// historical type
const hIstoricalSchemaObject = {
  users: {
    type: [{ type: userType }],
  },
  clients: {
    type: [{ type: clientType }],
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
  deletedAt: { type: Date, default: null },
};

const hIstoricalSchema = new Schema(hIstoricalSchemaObject, {
  timestamps: true,
});

module.exports.fieldsRequired = Object.keys(hIstoricalSchemaObject);
module.exports.HIstorical = mongoose.model("HIstorical", hIstoricalSchema);