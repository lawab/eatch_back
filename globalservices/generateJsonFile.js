const File = require("./File");
const {
  APP_URL_PRODUCT,
  APP_URL_MENU,
  APP_URL_RESTAURANT,
} = require("./remoteServices");
const { default: axios } = require("axios");

const getProductsByCategoriesForOneRestaurant = async (restaurantId, token) => {
  try {
    let { data: categories } = await axios.get(
      `${APP_URL_PRODUCT}/fetch/categories/${restaurantId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return categories;
  } catch (error) {
    throw new Error(error);
  }
};

const getMenusForOneRestaurant = async (restaurantId, token) => {
  try {
    let { data: menus } = await axios.get(
      `${APP_URL_MENU}/fetch/restaurant/${restaurantId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return menus;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
const getRestaurant = async (restaurantId, token) => {
  try {
    let { data: restaurant } = await axios.get(
      `${APP_URL_RESTAURANT}/fetch/one/${restaurantId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return restaurant;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

/**
 *
 * @param {String} restaurantId [id of restaurant ]
 * @param {token} token [token to authenticated user ]
 * @returns {Promise<String>}
 */
const addProductFromJsonFile = async (restaurantId, token) => {
  try {
    const FILENAME = "categories.json";
    // get all catégories for current restaurant in database
    let categories =
      (await getProductsByCategoriesForOneRestaurant(restaurantId, token)) ||
      [];

    // get all menus for current restaurant in database
    let menus = (await getMenusForOneRestaurant(restaurantId, token)) || [];

    let newMenus = menus
      .filter((menu) => !menu.deletedAt)
      .map((menu) => {
        let products = menu.products;
        let category = {};
        category["_id"] = menu["_id"];
        category["title"] = menu["menu_title"];
        category["price"] = menu["price"].toString();
        category["image"] = menu["image"];
        category["deletedAt"] = "null";
        category["createdAt"] = menu["createdAt"];
        category["updatedAt"] = menu["updatedAt"];

        // let newproducts = products.map((product) => {
        //   let p = {};
        //   p["_id"] = product._id;
        //   p["price"] = product.price.toString();
        //   p["productName"] = product.productName.toString();
        //   p["promotion"] = product.promotion.toString();
        //   p["devise"] = product.devise.toString();
        //   p["image"] = product.image.toString();
        //   p["deletedAt"] = "null";
        //   // p["createdAt"] = product.createdAt;
        //   // p["updatedAt"] = product.updatedAt;
        //   // p["quantity"] = Math.floor(Math.random() * 50).toString();
        //   return p;
        // });

        // category["products"] = [...newproducts];

        return category;
      });

    let newCategories = categories
      .filter((cat) => !cat.deletedAt)
      .map((cat) => {
        let products = cat.products;
        let category = {};
        category["_id"] = cat["_id"];
        category["title"] = cat["title"];
        category["image"] = cat["image"];
        category["deletedAt"] = "null";
        category["createdAt"] = cat["createdAt"];
        category["updatedAt"] = cat["updatedAt"];

        let newproducts = products
          .filter((prod) => !prod.deletedAt)
          .map((product) => {
            let p = {};
            p["_id"] = product._id;
            p["price"] = product.price.toString();
            p["productName"] = product.productName.toString();
            p["promotion"] = product.promotion.toString();
            p["devise"] = product.devise.toString();
            p["image"] = product.image.toString();
            p["deletedAt"] = "null";
            p["createdAt"] = product.createdAt;
            p["updatedAt"] = product.updatedAt;
            p["quantity"] = Math.floor(Math.random() * 50).toString();
            return p;
          });

        // console.log({ newproducts });

        category["products"] = [...newproducts];

        return category;
      });

    newCategories.push({
      title: "menu",
      menus: newMenus,
    });

    let file = new File();
    console.log({ categories: newCategories, menus: newMenus });

    let content = await file.writeToFile(
      FILENAME,
      JSON.stringify(newCategories)
    );

    return { content, categories: newCategories, menus: newMenus };
  } catch (error) {
    console.log({ errorjson: error });
    throw new Error(error.message);
  }
};

module.exports = {
  addProductFromJsonFile,
  getRestaurant,
};
