const mongoose = require("mongoose");
const restoSchema = new mongoose.Schema(
  {
    restaurant_name: { type: String, require: true, maxlength: 50 },
    infos: {
      town: { type: String, require: true },
      address: { type: String, require: true },
      logo: { type: String, require: true },
    },
    _creator: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    providings: [
      {
        material: { type: Object},
        laboratory: { type: Object },
        qte: { type: Number, require: false },
        date_providing: { type: Date, require: false },
        validated: { type: Boolean, default: false },
        date_validated: { type: Date, require: false, default: null },
      },
    ],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restoSchema);
