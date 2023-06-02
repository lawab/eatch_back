const { default: axios } = require("axios");
const { Logistic } = require("../models/logistic/logistic");

/**
 *
 * @param {Object} logisticBody [Body to create new logistic in database]
 * @returns {Promise}
 */
const createLogistic = async (logisticBody = {}) => {
  const logistic = await Logistic.create(logisticBody);
  return logistic;
};
/**
 *
 * @param {Object} query [query to find one logistic in database]
 * @returns {Promise}
 */
const findOneLogistic = async (query = {}) => {
  const logistic = await Logistic.findOne(query);
  return logistic;
};
/**
 *
 * @param {Object} query [query to delete one logistic in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const logistic = await Logistic.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return logistic;
};
/**
 *
 * @param {Object} query [query to get logistics in database]
 * @returns {Promise}
 */
const findLogistics = async (query = null) => {
  const logistics = await Logistic.find(query);
  return logistics;
};
/**
 *
 * @param {Object} query [query to get logistic in database]
 * @returns {Promise}
 */
const findLogistic = async (query = null) => {
  const logistic = await Logistic.findOne(query);
  return logistic;
};

/**
 *
 * @param {Object} query [query to update logistics in database]
 * @param {Object} bodyUpdate [body to update logistics in database]
 * @returns {Promise}
 */
const updateLogistic = async (query = null, bodyUpdate = {}) => {
  const logistic = await Logistic.findOneAndUpdate(
    query,
    { ...bodyUpdate },
    { new: true }
  );
  return logistic;
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
 * @param {String} id [id from creator who created logistic]
 * @param {Object} bodyUpdate [body to update historical]
 * @returns {Promise<Object>}
 */
const addElementToHistorical = async (id = null, bodyUpdate = {}, token) => {
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
 * @param {Object} query [query to find logistic in documents list. Default value is {}]
 * @returns {Promise}
 */
const deleteTrustlyElement = async (query = {}) => {
  const logistic = await Logistic.deleteOne(query);
  return logistic;
};

module.exports = {
  createLogistic,
  findOneLogistic,
  deleteOne,
  findLogistics,
  updateLogistic,
  getUserAuthor,
  findLogistic,
  getRestaurant,
  addElementToHistorical,
  deleteTrustlyElement,
};
