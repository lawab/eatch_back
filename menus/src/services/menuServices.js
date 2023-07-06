const { default: axios } = require("axios");
const { Menu } = require("../models/menu/menu");

/**
 *
 * @param {Object} menuBody [Body to create new menu in database]
 * @returns {Promise}
 */
const createMenu = async (menuBody = {}) => {
  const menu = await Menu.create(menuBody);
  return menu;
};
/**
 *
 * @param {Object} query [query to find one menu in database]
 * @returns {Promise}
 */
const findOneMenu = async (query = {}) => {
  const menu = await Menu.findOne(query);
  return menu;
};
/**
 *
 * @param {Object} query [query to delete one menu in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const menu = await Menu.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return menu;
};
/**
 *
 * @param {Object} query [query to get Materials in database]
 * @returns {Promise}
 */
const findMenus = async (query = null) => {
  const menus = await Menu.find(query);
  return menus;
};
/**
 *
 * @param {Object} query [query to get Materials in database]
 * @returns {Promise}
 */
const findMenu = async (query = null) => {
  const menu = await Menu.findOne(query);
  return menu;
};

/**
 *
 * @param {Object} query [query to update Materials in database]
 * @param {Object} bodyUpdate [body to update Materials in database]
 * @returns {Promise}
 */
const updateMenu = async (query = null, bodyUpdate = {}) => {
  const menu = await Menu.findOneAndUpdate(
    query,
    { ...bodyUpdate },
    { new: true }
  );
  return menu;
};

// get creator since microservice users
/**
 *
 * @param {Number} id [id to find author in database from eatch_users microservice]
 * @param {String} token [token to valid the session of author before to fetch him in database]
 * @returns {Promise} [return the current author send by eatch_users microservice]
 */
const getUserAuthor = async (id = null, token = null) => {
  let { data: creator } = await axios.get(
    `${process.env.APP_URL_USER}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return creator;
};

/**
 *
 * @param {Number} id [id to find restaurant in database from eatch_restaurants microservice]
 * @param {String} token [token to valid the session of user]
 * @returns {Promise<Object>} [return the current restaurant send by eatch_restaurants microservice]
 */
const getRestaurant = async (id = null, token = null) => {
  let { data: restaurant } = await axios.get(
    `${process.env.APP_URL_RESTAURANT}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return restaurant;
};

/**
 *
 * @param {Array<String>} ids [list of _id products that we want to get in database]
 * @param {String} token [token to authenticate user]
 * @returns {Promise<Array<Object>>} [Array of products found in database]
 */
const getProducts = async (ids = [], token = null) => {
  let { data: products } = await axios.get(
    `${process.env.APP_URL_PRODUCT}/fetch/all/${JSON.stringify(ids)}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return products;
};

/**
 *
 * @param {String} id [id from creator who created user]
 * @param {Object} bodyUpdate [body to update historical]
 * @returns {Promise<Object>}
 */
const addMenuToHistorical = async (id = null, bodyUpdate = {}, token) => {
  let response = await axios.put(
    `${process.env.APP_URL_HISTORICAL}/update/${id}`,
    bodyUpdate,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

/**
 *
 * @param {Number} id [id to find categories in database from eatch_category microservice]
 * @param {String} token [token to valid the session of user]
 * @returns {Promise<[Object]>} [return the current category send by eatch_category microservice]
 */
const getCategory = async (id = null, token = null) => {
  console.log("test", id, {
    url: `${process.env.APP_URL_CATEGORY}/fetch/one/${id}`,
  });
  let { data: category } = await axios.get(
    `${process.env.APP_URL_CATEGORY}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return category;
};

/**
 *
 * @param {Object} query [query to find menu in documents list. Default value is {}]
 * @returns {Promise}
 */
const deleteTrustlyMenu = async (query = {}) => {
  const menu = await Menu.deleteOne(query);
  return menu;
};

module.exports = {
  createMenu,
  findOneMenu,
  deleteOne,
  findMenus,
  updateMenu,
  getUserAuthor,
  findMenu,
  getRestaurant,
  getProducts,
  addMenuToHistorical,
  deleteTrustlyMenu,
  getCategory,
};
