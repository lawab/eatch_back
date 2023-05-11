const { status } = require("../models/status");
const { Client } = require("../models/Client");
const { default: axios } = require("axios");
//const { Client } = require("../controllers/ClientControllers");
/**
 *
 * @param {Object} ClientBody [Body to create new Client database]
 * @returns {Promise}
 */

const createClient = async (ClientBody = {}) => {
  const client = await Client.create(ClientBody);
  console.log({ client });
  return client;
};
/**
 *
 * @param {Object} query [query to find one Client database]
 * @returns {Promise}
 */
const findOneClient = async (query = {}) => {
  const client = await Client.findOne(query);
  return client;
};
/**
 *
 * @param {Object} query [query to delete one Client database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const client = await Client.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return client;
};
/**
 *
 * @param {Object} query [query to get Client database]
 * @returns {Promise}
 */
const findClients = async (query = null) => {
  const clients = await Client.find(query);
  return clients;
};
/**
 *
 * @param {Object} query [query to Client database]
 * @returns {Promise}
 */
const findClient = async (query = null) => {
  const client = await Client.findOne(query);
  return client;
};
/**
 *
 * @param {Object} query [query to update Clients in database]
 * @param {Object} bodyUpdate [body to update Clients in database]
 * @returns {Promise}
 */
const updateClient = async (id, bodyUpdate = {}) => {
  const client = await Client.findByIdAndUpdate(
    id,
    { ...bodyUpdate },
    { new: true }
  );
  return client;
  0;
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

// get creator since microservice users
/**
 *
 * @param {Number} id [id to find author in database from eatch_users microservice]
 * @param {String} token [token to valid the session of author before to fetch him in database]
 * @returns {Promise} [return the current author send by eatch_users microservice]
 */

const getRestaurant = async (id = null, token = null) => {
  console.log({ token });
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

module.exports = {
  createClient,
  findOneClient,
  deleteOne,
  findClients,
  updateClient,
  findClient,
  getRestaurant,
  getUserAuthor,
};
