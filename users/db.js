const mongoose = require("mongoose");
const { mode } = require("./env.config");
const superUser = require("./src/controllers/super_admin");

module.exports = async function connection() {
  try {
    mongoose.Promise = global.Promise;
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    console.log({ env: mode });
    const MONG0_URL =
      mode === "producion"
        ? `${process.env.MONG0_URL}?authSource=admin`
        : process.env.MONG0_URL;

    if (mode === "production") {
      connectionOptions["user"] = process.env.DBUSERNAME;
      connectionOptions["pass"] = process.env.DBPWD;
    }
    mongoose.connect(MONG0_URL, connectionOptions);
    console.log("base cree avec succes ");
    //Create a first super user automatically

    db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", () => {
      console.log("mongodb running...");
      superUser.createSuperUser();
    });
  } catch (error) {
    console.log(error);
    console.log("Could not connect to database!");
  }
};
