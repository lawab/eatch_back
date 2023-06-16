const mongoose = require("mongoose");
const Role = require("../roles");
const validator = require("validator");
const roles = require("../roles");
const Schema = mongoose.Schema;

const restaurantType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: String,
  infos: {
    town: String,
    address: String,
    logo: String,
  },
};

const laboratoryType = {
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
};
const UserSchemaObject = {
  restaurant: {
    type: restaurantType,
  },

  laboratory: { type: laboratoryType },

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
    unique: true,
    required: true,
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
    },
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: roles.SUPER_ADMIN,
    enum: [
      roles.SUPER_ADMIN,
      roles.COMPTABLE,
      roles.MANAGER,
      roles.RH,
      roles.LABORANTIN,
    ],
  },
  employer_type: {
    type: String,
  },
  avatar: {
    type: String,
    default: "/datas/avatar.png",
  },

  isOnline: {
    type: Boolean,
    default: false,
  },
  _creator: {
    type: Schema.ObjectId,
    ref: "User",
  },

  deletedAt: { type: Date, default: null },
};

const UserSchema = new Schema(UserSchemaObject, {
  timestamps: true,
});

UserSchema.pre("save", function (next) {
  console.log("pre save");
  if (this.firstName && this.lastName) {
    this.username = [this.firstName, this.lastName].join(" ");
  }
  next();
});

module.exports.default = mongoose.model("User", UserSchema);
module.exports.fieldsRequired = UserSchemaObject;
