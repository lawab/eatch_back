const { default: User } = require("../../models/user/users");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator"); // LOGIN WITH JWT
const print = require("../../log/print");
const login = async function (req, res) {
  try {
    // check if email of user is valided
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      print({ message: "Wrong credentials!" });
      return res.status(401).json({ message: "Wrong credentials!" });
    } else {
      const hashedPassword = cryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );

      const password = hashedPassword.toString(cryptoJS.enc.Utf8);
      if (password !== req.body.password) {
        print("Bad Password!");
        return res.status(401).json({ message: "Wrong credentials!" });
      }
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SEC, {
      expiresIn: "3d",
    });

    user.isOnline = true; // enable that user is online

    let userAuthenticated = await user.save();

    print("LOGIN SUCCESSFULY!");

    res.status(200).json({ userAuthenticated, accessToken });
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};

// EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  login,
};
