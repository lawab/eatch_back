const mongoose = require("mongoose");
const Role = require("../roles");
const validator = require("validator");
const Schema = mongoose.Schema;

const restaurantType = {
  _id: { type: mongoose.Types.ObjectId, required: true },
  restaurant_name: { type: String, required: true },
  infos: {
    town: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String, default: "/datas/avatar.png" },
  },
};

const UserSchemaObject = {
  restaurant: {
    type: restaurantType,
    required: function () {
      return this.role === Role.SUPER_ADMIN ? false : true;
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
    unique: true,
    required: true,
    validate: {
      validator: function (email) {
        return validator.isEmail(this.email);
      },
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: Role.SUPER_ADMIN,
    enum: [
      Role.SUPER_ADMIN,
      Role.RH,
      Role.COMPTABLE,
      Role.MANAGER,
      Role.EMPLOYEE,
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
