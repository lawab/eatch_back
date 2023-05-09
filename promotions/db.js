const mongoose = require("mongoose");
const { mode } = require("./env.config");
mongoose.set("strictQuery", false);

module.exports = async function connection() {
  try {
    mongoose.Promise = global.Promise;
    const connectioNOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    console.log({ env: mode });
    const MONG0_URL =
      mode === "producion"
        ? `${process.env.MONG0_URL}?authSource=admin`
        : process.env.MONG0_URL;

    if (mode === "production") {
      connectioNOptions["user"] = process.env.DBUSERNAME;
      connectioNOptions["pass"] = process.env.DBPWD;
    }
    mongoose.connect(MONG0_URL, connectioNOptions);
    console.log("base cree avec succès");
    //Create a first super user automatically

    db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", () => {
      console.log("mongodb connected successfully!!!");
    });
  } catch (error) {
    console.log(error);
    console.log("Could not connect to database!");
  }
};
