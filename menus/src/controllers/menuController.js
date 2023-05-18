const { fieldsRequired } = require("../models/menu/menu");
const { fieldsValidator } = require("../models/menu/validators");
const print = require("../log/print");
const menuServices = require("../services/menuServices");
const roles = require("../models/roles");
const updateForeignFields = require("./updateForeignFields");
const setForeignFields = require("./setForeignFields");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");

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

    // set user avatar
    body["image"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";

    let menu = await menuServices.createMenu(body);

    print({ menucreated: menu }, "*");

    if (menu?._id) {
      let response = await addElementToHistorical(
        async () => {
          let addResponse = await menuServices.addMenuToHistorical(
            creator._id,
            {
              menus: {
                _id: menu?._id,
                action: "CREATED",
              },
            },
            req.token
          );

          return addResponse;
        },
        async () => {
          let elementDeleted = await menuServices.deleteTrustlyMenu({
            _id: menu?._id,
          });
          print({ elementDeleted });
          return elementDeleted;
        }
      );

      return closeRequest(
        response,
        res,
        "Menu has been created successfully!!!",
        "Menu has  been not created successfully,please try again later,thanks!!!"
      );
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
    const { validate } = fieldsValidator(Object.keys(body), fieldsRequired);
    if (!validate) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }
    let creator = await menuServices.getUserAuthor(body?._creator, req.token);

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

    console.log({ menu });

    let menuCopy = Object.assign({}, menu._doc); // cppy documment before update it

    body["_creator"] = creator; //update creator who update the current menu

    //  update foreign Fields

    body = await updateForeignFields(menuServices, body, req.token);

    // update all valid fields before save it in database
    for (let key in body) {
      menu[key] = body[key];
    }

    // update avatar if exists
    menu["image"] = req.file ? "/datas/" + req.file?.filename : menu["image"];

    // update field in database
    let menusaved = await menu.save();

    if (menusaved?._id) {
      let response = await addElementToHistorical(
        async () => {
          let response = await menuServices.addMenuToHistorical(
            creator?._id,
            {
              menus: {
                _id: menusaved?._id,
                action: "UPDATED",
              },
            },
            req.token
          );

          return response;
        },
        async () => {
          for (const field in menuCopy) {
            if (Object.hasOwnProperty.call(menuCopy, field)) {
              menusaved[field] = menuCopy[field];
            }
          }
          let menuRestored = await menusaved.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ menuRestored });
          return menuRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "Menu has been updated successfully!!!",
        "Menu has not been Updated successfully,please try again later,thanks!!!"
      );
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
    let body = req.body;
    // check if creator have authorization
    let creator = await menuServices.getUserAuthor(body?._creator, req.token);

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

    let menu = await menuServices.findOneMenu({
      _id: req.params?.id,
      deletedAt: null,
    });

    if (!menu?._id) {
      return res.status(401).json({
        message:
          "unable to update menu beacuse it not exists or alreday deleted!!!",
      });
    }

    console.log({ menu });

    let menuCopy = Object.assign({}, menu._doc); // cppy documment before update it

    //update deleteAt and cretor fields from menu

    menu.deletedAt = Date.now(); // set date of deletion
    menu._creator = creator; // the current menu who do this action

    let MenuDeleted = await menu.save();

    print({ MenuDeleted });

    if (MenuDeleted?.deletedAt) {
      let response = await addElementToHistorical(
        async () => {
          let response = await menuServices.addMenuToHistorical(
            creator?._id,
            {
              menus: {
                _id: MenuDeleted?._id,
                action: "DELETED",
              },
            },
            req.token
          );

          return response;
        },
        async () => {
          for (const field in menuCopy) {
            if (Object.hasOwnProperty.call(menuCopy, field)) {
              MenuDeleted[field] = menuCopy[field];
            }
          }
          let menuRestored = await MenuDeleted.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ menuRestored });
          return menuRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "Menu has been delete successfully!!!",
        "Menu has not been delete successfully,please try again later,thanks!!!"
      );
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
