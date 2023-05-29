const { default: axios } = require("axios");
const { HIstorical } = require("../models/historical/historical");

/**
 * @param {String} field [field that we want to update from historical in database]
 * @param {Object} hIstoricalBody [Body to update hIstorical in database]
 * @returns {Promise}
 */
const updateHistorical = async (query = {}, bodyQueryUpdate = {}) => {
  try {
    const hIstorical = await HIstorical.updateOne(query, {
      ...bodyQueryUpdate,
    });
    return hIstorical;
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 *
 * @param {Object} query [query to find one hIstorical in database]
 * @returns {Promise}
 */
const findOneHIstorical = async (query = {}) => {
  try {
    const hIstorical = await HIstorical.findOne(query);
    return hIstorical;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {Object} query [query to get hIstoricals in database]
 * @returns {Promise}
 */
const findHIstoricals = async (query = null) => {
  try {
    const hIstoricals = await HIstorical.find(query, {});
    return hIstoricals;
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 *
 * @param {Object} query [query to get hIstorical in database]
 * @returns {Promise}
 */
const findHIstorical = async (query = null) => {
  try {
    const hIstorical = await HIstorical.findOne(query);
    return hIstorical;
  } catch (error) {
    throw new Error(error.message);
  }
};

// get creator since microservice users
/**
 *
 * @param {Number} id [id to find author in database from eatch_users microservice]
 * @param {String} token [token to valid the session of author before to fetch him in database]
 * @returns {Promise} [return the current author send by eatch_users microservice]
 */
const getUser = async (id = null, token = null) => {
  try {
    let { data: creator } = await axios.get(
      `${process.env.APP_URL_USER}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return creator;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {String} id [id to find client in database from eatch_clients microservice]
 * @param {String} token [token to valid the session of author before to fetch him in database]
 * @returns {Promise} [return the current client (if exists) send by eatch_clients microservice]
 */
const getClient = async (id = null, token = null) => {
  try {
    let { data: client } = await axios.get(
      `${process.env.APP_URL_CLIENT}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return client;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {String} id [ObjectId to find restaurant in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
 */
const getRestaurant = async (id = null, token = null) => {
  try {
    let { data: restaurant } = await axios.get(
      `${process.env.APP_URL_RESTAURANT}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return restaurant;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {String} id [ObjectId to find product in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
 */
const getProduct = async (id = null, token = null) => {
  try {
    let { data: product } = await axios.get(
      `${process.env.APP_URL_PRODUCT}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {String} id [ObjectId to find material in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
 */
const getMaterial = async (id = null, token = null) => {
  try {
    let { data: material } = await axios.get(
      `${process.env.APP_URL_MATERIAL}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return material;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {String} id [ObjectId to find order in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
 */
const getOrder = async (id = null, token = null) => {
  try {
    let { data: order } = await axios.get(
      `${process.env.APP_URL_ORDER}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {String} id [ObjectId to find menu in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
 */
const getMenu = async (id = null, token = null) => {
  try {
    let { data: menu } = await axios.get(
      `${process.env.APP_URL_MENU}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return menu;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {String} id [ObjectId to find invoice in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
 */
const getInvoice = async (id = null, token = null) => {
  try {
    let { data: invoice } = await axios.get(
      `${process.env.APP_URL_INVOICE}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return invoice;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {String} id [ObjectId to find promotion in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
 */
const getPromotion = async (id = null, token = null) => {
  try {
    let { data: promotion } = await axios.get(
      `${process.env.APP_URL_PROMOTION}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return promotion;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {String} id [ObjectId to find logistic in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
 */
const getLogistic = async (id = null, token = null) => {
  try {
    let { data: logistic } = await axios.get(
      `${process.env.APP_URL_LOGISTIC}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return logistic;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {String} id [ObjectId to find category in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
 */
const getCategorie = async (id = null, token = null) => {
  try {
    let { data: category } = await axios.get(
      `${process.env.APP_URL_CATEGORY}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return category;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  updateHistorical,
  findOneHIstorical,
  findHIstoricals,
  findHIstorical,

  // all methods to call all necessaires service and retrive data

  getUser,
  getClient,
  getRestaurant,
  getProduct,
  getMaterial,
  getOrder,
  getMenu,
  getInvoice,
  getPromotion,
  getLogistic,
  getCategorie,
};
