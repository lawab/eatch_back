const cryptoJS = require("crypto-js");
const User = require("../models/users");
const Role = require("../models/roles");
const userService = require("../../services/userServices");

//Create user in Data Base
const createUser = async (req, res) => {
  try {
    var isAdmin = false;
    if (req.body.role == Role.admin) {
      isAdmin = true;
    }
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
      password: cryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
      isAdmin: isAdmin,
      avatar: req.file ? "/datas/" + req.file.filename : "/datas/avatar.png",
      autorisation: req.body.autorisation,
    });
    console.log(req.body.autorisation);
    console.log("####################");
    console.log(newUser);
    const user = await userService.createUser(newUser);
    res.status(200).json({ message: "User created successfully!!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd creating user!!!" });
  }
};

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  createUser,
};
