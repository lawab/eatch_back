const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { userType } = require("../externals/userType");
const { materialType } = require("../externals/materialType");
const { productType } = require("../externals/productType");
const { orderType } = require("../externals/orderType");
const { restaurantType } = require("../externals/restaurantType");
const { menuType } = require("../externals/menuType");
const { invoiceType } = require("../externals/invoiceType");
const { clientType } = require("../externals/clientType");
const { promotionType } = require("../externals/promotionType");
const { logisticType } = require("../externals/logisticType");
const { categeryType } = require("../externals/categeryType");
const { recetteType } = require("../externals/recetteType");

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
    type: [{ type: orderType }],
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
  clients: {
    type: [{ type: clientType }],
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
