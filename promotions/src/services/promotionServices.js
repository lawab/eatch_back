const { default: axios } = require("axios");
const { Promotion } = require("../models/promotion/promotion");

/**
 *
 * @param {Object} promotionBody [Body to create new promotion in database]
 * @returns {Promise}
 */
const createPromotion = async (promotionBody = {}) => {
  const promotion = await Promotion.create(promotionBody);
  return promotion;
};
/**
 *
 * @param {Object} query [query to find one promotion in database]
 * @returns {Promise}
 */
const findOnePromotion = async (query = {}) => {
  const promotion = await Promotion.findOne(query);
  return promotion;
};
/**
 *
 * @param {Object} query [query to delete one promotion in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const promotion = await Promotion.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return promotion;
};
/**
 *
 * @param {Object} query [query to get promotions in database]
 * @returns {Promise}
 */
const findPromotions = async (query = null) => {
  const promotions = await Promotion.find(query);
  return promotions;
};
/**
 *
 * @param {Object} query [query to get promotion in database]
 * @returns {Promise}
 */
const findPromotion = async (query = null) => {
  const promotion = await Promotion.findOne(query);
  return promotion;
};

/**
 *
 * @param {Object} query [query to update promotions in database]
 * @param {Object} bodyUpdate [body to update promotions in database]
 * @returns {Promise}
 */
const updatePromotion = async (query = null, bodyUpdate = {}) => {
  const promotion = await Promotion.findOneAndUpdate(
    query,
    { ...bodyUpdate },
    { new: true }
  );
  return promotion;
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
 * @param {*} token [token to valid the session of user]
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
 * @param {String} id [_id product that we want to get in database]
 * @param {String} token [token to authenticate user]
 * @returns {Promise<Object>} [Object product found in database]
 */
const getProduct = async (id = null, token = null) => {
  let { data: product } = await axios.get(
    `${process.env.APP_URL_PRODUCT}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return product;
};

/**
 *
 * @param {String} id [_id menu that we want to get in database]
 * @param {String} token [token to authenticate user]
 * @returns {Promise<Object>} [Object menu found in database]
 */
const getMenu = async (id = null, token = null) => {
  let { data: product } = await axios.get(
    `${process.env.APP_URL_MENU}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return product;
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
 * @param {String} id [id from creator who created user]
 * @param {Object} bodyUpdate [body to update historical]
 * @returns {Promise<Object>}
 */
const addPromotionToHistorical = async (id = null, bodyUpdate = {}, token) => {
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
 * @param {Object} query [query to find promotion in documents list. Default value is {}]
 * @returns {Promise}
 */
const deleteTrustlyPromotion = async (query = {}) => {
  const promotion = await Promotion.deleteOne(query);
  return promotion;
};

module.exports = {
  createPromotion,
  findOnePromotion,
  deleteOne,
  findPromotions,
  updatePromotion,
  getUserAuthor,
  findPromotion,
  getRestaurant,
  getProduct,
  getMenu,
  getClient,
  addPromotionToHistorical,
  deleteTrustlyPromotion,
};
