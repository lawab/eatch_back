const { default: User } = require("../models/user/users");
const role = require("../models/roles");
const cryptoJS = require("crypto-js");

exports.createSuperUser = function () {
  User.findOne({ role: role.SUPER_ADMIN }, (err, user) => {
    if (err) {
      console.log("err");
      console.log(err);
    } else {
      if (user == null) {
        var data = {};
        data.email = process.env.ADMIN_MAIL;
        data.firstName = process.env.FIRSTNAME;
        data.lastName = process.env.LASTNAME;
        data.username = [process.env.FIRSTNAME, process.env.LASTNAME].join(" ");
        data.password = cryptoJS.AES.encrypt(
          process.env.SUPER_SEC,
          process.env.PASS_SEC
        ).toString();
        data.role = role.SUPER_ADMIN;
        // Then save the user
        User.create(data, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Super Admin compte created");
          }
        });
      } else {
        console.log("Super Admin compte already exists");
        return true;
      }
    }
  });
};
