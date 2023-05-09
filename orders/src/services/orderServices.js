const { default: axios } = require("axios");
const { default: Order } = require("../models/order/order");

/**
 *
 * @param {Object} orderBody [Body to create new order in database]
 * @returns {Promise}
 */
const createOrder = async (orderBody = {}) => {
  const order = await Order.create(orderBody);
  return order;
};
/**
 *
 * @param {Object} query [query to find one order in database]
 * @returns {Promise}
 */
const findOneOrder = async (query = {}) => {
  const order = await Order.findOne(query);
  return order;
};
/**
 *
 * @param {Object} query [query to delete one order in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const order = await Order.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return order;
};
/**
 *
 * @param {Object} query [query to get products in database]
 * @returns {Promise}
 */
const findOrders = async (query = null) => {
  const products = await Order.find(query);
  return products;
};
/**
 *
 * @param {Object} query [query to get products in database]
 * @returns {Promise}
 */
const findOrder = async (query = null) => {
  const order = await Order.findOne(query);
  return order;
};

/**
 *
 * @param {Object} query [query to update products in database]
 * @param {Object} bodyUpdate [body to update products in database]
 * @returns {Promise}
 */
const updateOrder = async (query = null, bodyUpdate = {}) => {
  const order = await Order.findOneAndUpdate(
    query,
    { ...bodyUpdate },
    { new: true }
  );
  return order;
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
 * @param {*} id [id to find client in database from eatch_clients microservice]
 * @param {*} token [token to valid the session of author before to fetch him in database]
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
const getProducts = async (ids = [], token = null) => {
  let { data: products } = await axios.get(
    `${process.env.APP_URL_PRODUCTS}/fetch/all/${JSON.stringify(ids)}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return products;
};
module.exports = {
  createOrder,
  findOneOrder,
  deleteOne,
  findOrders,
  updateOrder,
  getUserAuthor,
  findOrder,
  getClient,
  getRestaurant,
  getProducts,
};
