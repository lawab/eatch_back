const { default: axios } = require("axios");
const { Comment } = require("../models/comment/comment");

/**
 *
 * @param {Object} productBody [Body to create new product in database]
 * @returns {Promise}
 */
const createComment = async (productBody = {}) => {
  const product = await Comment.create(productBody);
  return product;
};
/**
 *
 * @param {Object} query [query to find one product in database]
 * @returns {Promise}
 */
const findOneComment = async (query = {}) => {
  const product = await Comment.findOne(query);
  return product;
};
/**
 *
 * @param {Object} query [query to delete one product in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const product = await Comment.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return product;
};
/**
 *
 * @param {Object} query [query to get products in database]
 * @returns {Promise}
 */
const findComments = async (query = null) => {
  const products = await Comment.find(query);
  return products;
};
/**
 *
 * @param {Object} query [query to get product in database]
 * @returns {Promise}
 */
const findComment = async (query = null) => {
  const product = await Comment.findOne(query);
  return product;
};

/**
 *
 * @param {Object} query [query to update products in database]
 * @param {Object} bodyUpdate [body to update products in database]
 * @returns {Promise}
 */
const updateComment = async (query = null, bodyUpdate = {}) => {
  const product = await Comment.findOneAndUpdate(
    query,
    { ...bodyUpdate },
    { new: true }
  );
  return product;
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

module.exports = {
  createComment,
  findOneComment,
  deleteOne,
  findComments,
  updateComment,
  getUserAuthor,
  findComment,
  getClient,
};
