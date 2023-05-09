const { fieldsRequired } = require("../models/menu/menu");
const { fieldsValidator } = require("../models/menu/validators");
const print = require("../log/print");
const menuServices = require("../services/menuServices");
const roles = require("../models/roles");
const updateForeignFields = require("./updateForeignFields");
const setForeignFields = require("./setForeignFields");

// create one Menu
const createMenu = async (req, res) => {
  try {
    let body = req.body;
    // verify fields on body
    let { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

    // if body have invalid fields
    if (!validate) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    // get creator since microservice users
    let creator = await menuServices.getUserAuthor(body?._creator, req.token);

    print({ creator: creator?._id }, "*");

    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send,you must authenticated to create a menu!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "you have not authorization to create menu,please see you administrator",
      });
    }

    body["_creator"] = creator; //set creator value found in database

    body = await setForeignFields(menuServices, body, req.token);

    let menu = await menuServices.createMenu(body);

    print({ menu }, "*");

    if (menu?._id) {
      res
        .status(200)
        .json({ message: "Menu has been created successfully!!!" });
    } else {
      res
        .status(200)
        .json({ message: "Menu has been not created successfully!!!" });
    }
  } catch (error) {
    print(error, "x");
    return res
      .status(500)
      .json({ message: "Error occured during a creation of Menu!!!" });
  }
};

// update Menu
const updateMenu = async (req, res) => {
  try {
    // get body request
    let body = req.body;
    // get the auathor to update Menu
    const { validate } = fieldsValidator(Object.keys(req.body), fieldsRequired);
    if (!validate) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }
    let creator = await menuServices.getUserAuthor(
      req.body?._creator,
      req.token
    );

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "you don't have authorization to update current menu,please see you administrator!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "you have not authorization to update menu,please see you administrator",
      });
    }
    let menu = await menuServices.findOneMenu({
      _id: req.params?.id,
    });

    if (!menu?._id) {
      return res.status(401).json({
        message: "unable to update menu beacuse it not exists!!!",
      });
    }

    body["_creator"] = creator; //update creator who update the current menu

    //  update foreign Fields

    body = await updateForeignFields(menuServices, body, req.token);

    // update all valid fields before save it in database
    for (let key in body) {
      menu[key] = body[key];
    }

    // update field in database
    let menusaved = await menu.save();

    if (menusaved?._id) {
      print({ menusaved: menusaved }, "ok");
      return res
        .status(200)
        .json({ message: "menu has been updated successfully!!!" });
    } else {
      return res.status(401).json({
        message: "menu has been not updated successfully!!!",
      });
    }
  } catch (error) {
    print(error.message, "x");
    res.status(500).json({
      message: "Error(s) occured during the update Menu!!!",
    });
  }
};
// delete one Menu
const deleteMenu = async (req, res) => {
  try {
    // check if creator have authorization
    let creator = await menuServices.getUserAuthor(
      req.body?._creator,
      req.token
    );

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "Invalid data send: you must authenticated to delete current materail!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "you have not authorization to delete menu,please see you administrator",
      });
    }

    // find and delete Menu
    let MenuDeleted = await menuServices.deleteOne(
      {
        _id: req.params?.id,
        deletedAt: null,
      },
      { _creator: creator, deletedAt: Date.now() } //set user creator and the date of deletion,no drop Menu
    );

    // if menu not exits or had already deleted
    if (!MenuDeleted) {
      return res.status(401).json({
        message:
          "unable to delete menu because it not exists or already deleted!!!",
      });
    }
    if (MenuDeleted?.deletedAt) {
      print({ MenuDeleted: MenuDeleted }, "s");
      return res
        .status(200)
        .json({ message: "menu has been deleted sucessfully" });
    } else {
      return res.status(500).json({ message: "deletion of menu failed" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error(s) occured during the deletion of Menu!!!" });
  }
};
// fetch one menu in database
const fetchMenu = async (req, res) => {
  try {
    let Menu = await menuServices.findMenu({
      _id: req.params?.id,
    });
    res.status(200).json(Menu);
  } catch (error) {
    print(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};
// get Menus
const fetchMenus = async (req, res) => {
  try {
    print({ ids: req.params?.ids });
    if (req.params?.ids) {
      let ids = JSON.parse(req.params?.ids);
      let Menus = await menuServices.findMenus({
        _id: { $in: ids },
      });
      res.status(200).json(Menus);
    } else {
      let Menus = await menuServices.findMenus();
      res.status(200).json(Menus);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch Menus by restaurant
const fetchMenusByRestaurant = async (req, res) => {
  try {
    let Menus = await menuServices.findMenus({
      "restaurant._id": req.params?.id,
    });
    res.status(200).json(Menus);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

module.exports = {
  createMenu,
  updateMenu,
  deleteMenu,
  fetchMenus,
  fetchMenu,
  fetchMenusByRestaurant,
};
