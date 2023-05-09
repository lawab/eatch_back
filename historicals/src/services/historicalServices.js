const { default: axios } = require("axios");
const { HIstorical } = require("../models/historical/historical");

/**
 * @param {String} field [field that we want to create a new historical in database]
 * @param {Object} hIstoricalBody [Body to create new hIstorical in database]
 * @returns {Promise}
 */
const createHIstorical = async (query = {}, hIstoricalBody = {}) => {
  const hIstorical = await HIstorical.updateOne(query, { ...hIstoricalBody });
  return hIstorical;
};
/**
 *
 * @param {Object} query [query to find one hIstorical in database]
 * @returns {Promise}
 */
const findOneHIstorical = async (query = {}) => {
  const hIstorical = await HIstorical.findOne(query);
  return hIstorical;
};

/**
 *
 * @param {Object} query [query to get hIstoricals in database]
 * @returns {Promise}
 */
const findHIstoricals = async (query = null) => {
  const hIstoricals = await HIstorical.find(query, {});
  return hIstoricals;
};
/**
 *
 * @param {Object} query [query to get hIstorical in database]
 * @returns {Promise}
 */
const findHIstorical = async (query = null) => {
  const hIstorical = await HIstorical.findOne(query);
  return hIstorical;
};

// get creator since microservice users
/**
 *
 * @param {Number} id [id to find author in database from eatch_users microservice]
 * @param {String} token [token to valid the session of author before to fetch him in database]
 * @returns {Promise} [return the current author send by eatch_users microservice]
 */
const getUser = async (id = null, token = null) => {
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
 * @param {String} id [id to find client in database from eatch_clients microservice]
 * @param {String} token [token to valid the session of author before to fetch him in database]
 * @returns {Promise} [return the current client (if exists) send by eatch_clients microservice]
 */
const getClient = async (id = null, token = null) => {
  let { data: client } = await axios.get(
    `${process.env.APP_URL_CLIENT}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return client;
};

/**
 *
 * @param {String} id [ObjectId to find restaurant in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
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
 * @param {String} id [ObjectId to find restaurant in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
 */
const getProducts = async (id = null, token = null) => {
  let { data: products } = await axios.get(
    `${process.env.APP_URL_PRODUCTS}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return products;
};

module.exports = {
  createHIstorical,
  findOneHIstorical,
  findHIstoricals,
  getUser,
  findHIstorical,
  getClient,
  getRestaurant,
  getProducts,
};
