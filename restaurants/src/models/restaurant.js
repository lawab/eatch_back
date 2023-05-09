const mongoose = require("mongoose");
const restoSchema = new mongoose.Schema(
  {
    restaurant_name: { type: String, require: true, maxlength: 50 },
    info: {
      town: { type: String, require: true },
      address: { type: String, require: true },
      logo: { type: String, require: true },
    },
    _creator: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restoSchema);
