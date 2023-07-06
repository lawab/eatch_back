const { fieldsRequired } = require("../models/menu/menu");
const { fieldsValidator } = require("../models/menu/validators");
const menuServices = require("../services/menuServices");
const roles = require("../models/roles");
const updateForeignFields = require("./updateForeignFields");
const setForeignFields = require("./setForeignFields");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");
const {
  addProductFromJsonFile,
} = require("../../../globalservices/generateJsonFile");
const { shellService } = require("../../../globalservices/shelService");

// create one Menu
const createMenu = async (req, res) => {
  let menu = null;
  try {
    // let body = req.body;
    let body = JSON.parse(req.headers.body);
    console.log({ body });
    let bodyUpdated = await setForeignFields(body, req, req.token);

    menu = await menuServices.createMenu(bodyUpdated);

    console.log({ menucreated: menu }, "*");

    if (menu) {
      let response = await addElementToHistorical(
        async () => {
          let addResponse = await menuServices.addMenuToHistorical(
            menu._creator._id,
            {
              menus: {
                _id: menu._id,
                action: "CREATED",
              },
            },
            req.token
          );

          let { content } = await addProductFromJsonFile(
            bodyUpdated.restaurant._id,
            req.token
          );

          console.log({ content: JSON.parse(content) });

          await shellService(bodyUpdated.restaurant._id, req.token);

          return addResponse;
        },
        async () => {
          let elementDeleted = await menuServices.deleteTrustlyMenu({
            _id: menu._id,
          });
          console.log({ elementDeleted });
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
    if (menu) {
      let elementDeleted = await menuServices.deleteTrustlyMenu({
        _id: menu._id,
      });
      console.log({ elementDeleted });
    }

    console.log({ error });

    return res
      .status(500)
      .json({ message: "Error occured during a creation of Menu!!!" });
  }
};

// update Menu
const updateMenu = async (req, res) => {
  let menusaved = null;
  let menuCopy = null;
  try {
    // get body request
    // let body = req.body;
    let body = JSON.parse(req.headers.body);
    console.log({ body });
    let menu = await menuServices.findOneMenu({
      _id: req.params?.id,
    });

    if (!menu?._id) {
      return res.status(401).json({
        message: "unable to update menu because it not exists!!!",
      });
    }

    console.log({ menu });

    menuCopy = Object.assign({}, menu._doc); // cppy documment before update it

    //  update foreign Fields

    let bodyUpdated = await updateForeignFields(body, req, req.token);

    // update all valid fields before save it in database
    for (let key in body) {
      menu[key] = bodyUpdated[key];
    }

    // update field in database
    menusaved = await menuServices.updateMenu(
      {
        _id: req.params?.id,
      },
      bodyUpdated
    );

    console.log({ menusaved });

    if (menusaved?._id) {
      let response = await addElementToHistorical(
        async () => {
          let response = await menuServices.addMenuToHistorical(
            menusaved._creator._id,
            {
              menus: {
                _id: menusaved._id,
                action: "UPDATED",
              },
            },
            req.token
          );

          let { content } = await addProductFromJsonFile(
            bodyUpdated.restaurant._id,
            req.token
          );
          console.log({ content: JSON.parse(content) });

          await shellService(bodyUpdated.restaurant._id, req.token);

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
          console.log({ menuRestored });
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
    if (menuCopy && menusaved) {
      for (const field in menuCopy) {
        if (Object.hasOwnProperty.call(menuCopy, field)) {
          menusaved[field] = menuCopy[field];
        }
      }
      let menuRestored = await menusaved.save({
        timestamps: false,
      }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
      console.log({ menuRestored });
    }
    console.log(error.message, "x");
    res.status(500).json({
      message: "Error(s) occured during the update Menu!!!",
    });
  }
};
// delete one Menu
const deleteMenu = async (req, res) => {
  let MenuDeleted = null;
  let menuCopy = null;
  try {
    let body = JSON.parse(req.headers.body);

    // check if creator have authorization
    let creator = await menuServices.getUserAuthor(body?._creator, req.token);

    if (
      !creator ||
      ![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)
    ) {
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

    menuCopy = Object.assign({}, menu._doc); // cppy documment before update it

    //update deleteAt and cretor fields from menu

    menu.deletedAt = Date.now();

    menu._creator = creator;

    MenuDeleted = await menu.save();

    console.log({ MenuDeleted });

    if (MenuDeleted?.deletedAt) {
      let response = await addElementToHistorical(
        async () => {
          let response = await menuServices.addMenuToHistorical(
            MenuDeleted._creator._id,
            {
              menus: {
                _id: MenuDeleted._id,
                action: "DELETED",
              },
            },
            req.token
          );

          let { content } = await addProductFromJsonFile(
            MenuDeleted.restaurant._id,
            req.token
          );
          console.log({ content: JSON.parse(content) });

          await shellService(MenuDeleted.restaurant._id, req.token);

          return response;
        },
        async () => {
          // restore only fields would had changed in database
          MenuDeleted["deletedAt"] = menuCopy["deletedAt"];
          MenuDeleted["updatedAt"] = menuCopy["updatedAt"];
          MenuDeleted["createdAt"] = menuCopy["createdAt"];
          let menuRestored = await MenuDeleted.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          console.log({ menuRestored });
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
    if (MenuDeleted && menuCopy) {
      // restore only fields would had changed in database
      MenuDeleted["deletedAt"] = menuCopy["deletedAt"];
      MenuDeleted["updatedAt"] = menuCopy["updatedAt"];
      MenuDeleted["createdAt"] = menuCopy["createdAt"];
      let menuRestored = await MenuDeleted.save({
        timestamps: false,
      }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database

      console.log({ menuRestored });
    }
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
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};
// get Menus
const fetchMenus = async (req, res) => {
  try {
    let menus = [];
    let ids = req.params?.ids ? JSON.parse(req.params?.ids) : [];
    console.log({ ids });
    if (ids.length) {
      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        let menu = await menuServices.findMenu({
          _id: id,
        });
        menus.push(menu);
      }
      console.log({ menus }, "~");
      res.status(200).json(menus);
    } else {
      let menus = await menuServices.findMenus();
      res.status(200).json(menus);
    }
  } catch (error) {
    console.log(error.message, "x");
    throw new Error(error);
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
