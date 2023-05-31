const mongoose = require("mongoose");
const category = require("./src/models/category");
mongoose.set("strictQuery", true);
module.exports = async function () {
  try {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONG0_URL, {
      user: process.env.DBUSERNAME,
      pass: process.env.DBPWD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", () => {
      console.log("base cree avec succes ");
      console.log("mongodb running...");
    });
  } catch (error) {
    console.log(error);
    console.log("Could not connect to database!");
  }
};
