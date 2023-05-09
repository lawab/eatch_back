const mongoose = require("mongoose");
const { mode } = require("./env.config");
const { HIstorical } = require("./src/models/historical/historical");
mongoose.set("strictQuery", false);
module.exports = async function connection() {
  try {
    mongoose.Promise = global.Promise;
    // const connectioNOptions = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // };
    // console.log({ env: mode });
    // const MONG0_URL =
    //   mode === "producion"
    //     ? `${process.env.MONG0_URL}?authSource=admin`
    //     : process.env.MONG0_URL;

    // if (mode === "production") {
    //   connectioNOptions["user"] = process.env.DBUSERNAME;
    //   connectioNOptions["pass"] = process.env.DBPWD;
    // }
    // mongoose.connect(MONG0_URL, connectioNOptions);
    mongoose.connect(process.env.MONG0_URL, {
      user: process.env.DBUSERNAME,
      pass: process.env.DBPWD,
    });
    console.log("base cree avec succès");
    //Create a first super user automatically

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
