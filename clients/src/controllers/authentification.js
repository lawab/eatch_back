const { Client } = require("../models/Client");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator"); // LOGIN WITH JWT
const login = async function (req, res) {
  try {
    // check if email of user is valided
    if (!isEmail(req.body.email) || !req.body.password) {
      console.log("Bad data!");
      return res.status(401).json({ message: "Wrong credentials!" });
    } else {
      const client = await Client.findOne({ email: req.body.email });

      if (!client) {
        console.log("Bad mail!");
        return res.status(401).json({ message: "Wrong credentials!" });
      } else {
        const hashedPassword = cryptoJS.AES.decrypt(
          client.password,
          process.env.PASS_SEC
        );
        const password = hashedPassword.toString(cryptoJS.enc.Utf8);
        if (password !== req.body.password) {
          console.log("Bad Password!");
          return res.status(401).json({ message: "Wrong credentials!" });
        }
      }

      const accessToken = jwt.sign({ id: Client._id }, process.env.JWT_SEC, {
        expiresIn: "3d",
      });

      client.isOnline = true; // enable that user is online
      await client.save();
      res.status(200).json({ client, accessToken });
      console.log("LOGIN SUCCESSFULY!");
    }
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};

// EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  login,
};
