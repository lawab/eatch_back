const mongoose = require("mongoose");
const { HIstorical } = require("./src/models/historical/historical");
mongoose.set("strictQuery", false);

module.exports = async function connection() {
  try {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONG0_URL, {
      user: process.env.DBUSERNAME,
      pass: process.env.DBPWD,
    });
    console.log("base cree avec succès");

    db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", async () => {
      console.log("mongodb connected successfully!!!");
      let historical = await HIstorical.findOne({});

      if (historical?._id) {
        console.log("historique already exists!!!");
      } else {
        HIstorical.create({
          users: [],
          clients: [],
          products: [],
          materials: [],
          orders: [],
          restaurants: [],
          menus: [],
          invoices: [],
        }).then(() => console.log("historique créer avec succès!!!"));
      }
    });
  } catch (error) {
    console.log(error);
    console.log("Could not connect to database!");
  }
};
