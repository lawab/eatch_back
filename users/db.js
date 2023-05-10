const mongoose = require("mongoose");
const superUser = require("./src/controllers/super_admin");

module.exports = async function connection() {
  try {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONG0_URL, {
      user: process.env.DBUSERNAME,
      pass: process.env.DBPWD,
    });
    console.log("base cree avec succes ");

    db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", () => {
      console.log("mongodb running...");
      superUser.createSuperUser(); //Create a first super user automatically
    });
  } catch (error) {
    console.log(error);
    console.log("Could not connect to database!");
  }
};
