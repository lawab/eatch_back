const { default: User } = require("../../models/user/users");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator"); // LOGIN WITH JWT
const print = require("../../log/print");
const login = async function (req, res) {
  console.log("BOOODDDYYY:");
    console.log(req.body);
    // const body = JSON.parse(req.headers.body);
    // console.log(body);
  try {
    // check if email of user is valided
    if (!isEmail(body?.email) || !body?.password) {
      console.log("Bad data!");
      return res.status(401).json({ message: "Wrong credentials!" });
    } else {
      const user = await User.findOne({ email: body.email });

      if (!user) {
        console.log("Bad mail!");
        return res.status(401).json({ message: "Wrong credentials!" });
      } else {
        const hashedPassword = cryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SEC
        );
        const password = hashedPassword.toString(cryptoJS.enc.Utf8);
        if (password !== body.password) {
          console.log("Bad Password!");
          return res.status(401).json({ message: "Wrong credentials!" });
        }
      }

      const accessToken = jwt.sign(
        { id: user._id, isAdmin: user.role },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
      );

      user.isOnline = true; // enable that user is online
      let userAuthenticated = await user.save();
      if (userAuthenticated?._id) {
        res.status(200).json({ user: userAuthenticated, accessToken });
        print("LOGIN SUCCESSFULY!");
      } else {
        res.status(401).json({
          message: "User authentification failed,please try again!!!",
        });
        print("LOGIN failed!!!");
      }
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
