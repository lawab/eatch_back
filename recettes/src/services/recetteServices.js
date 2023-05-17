const Recette = require("../models/recette");
const { default: axios } = require("axios");
//const { default: recette } = require("../models/recette/recette");

/**
 *
 * @param {Object} recetteBody [Body to create new Recette in database]
 * @returns {Promise}
 */

const createRecette = async (recetteBody = {}) => {
  const recette = await Recette.create(recetteBody);
  return recette;
};
/**
 *
 * @param {Object} query [query to find one Recette in database]
 * @returns {Promise}
 */
const findOneRecette = async (query = {}) => {
  const recette = await Recette.findOne(query);
  return recette;
};
/**
 *
 * @param {Object} query [query to delete one Recette in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const recette = await Recette.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return recette;
};
/**
 *
 * @param {Object} query [query to get Recette in database]
 * @returns {Promise}
 */
const findRecettes = async (query = null) => {
  const recettes = await Recette.find(query);
  return recettes;
};
/**
 *
 * @param {Object} query [query to Recette in database]
 * @returns {Promise}
 */
const findRecette = async (query = null) => {
  const recette = await Recette.findOne(query);
  return recette;
};
/**
 *
 * @param {Object} query [query to update Recettes in database]
 * @param {Object} bodyUpdate [body to update Recettes in database]
 * @returns {Promise}
 */
const updateRecette = async (id, bodyUpdate = {}) => {
  const recette = await Recette.findByIdAndUpdate(
    id,
    { ...bodyUpdate },
    { new: true }
  );
  return recette;
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
const getClients = async (id = null, token = null) => {
  let { data: client } = await axios.get(
    `${process.env.APP_URL_CLIENT}/fetch/recette/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return client;
};

const getMaterials = async (ids = [], token = null) => {
  let { data: products } = await axios.get(
    `${process.env.APP_URL_MATERIAL}/fetch/all/${JSON.stringify(ids)}`,
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
  createRecette,
  findOneRecette,
  deleteOne,
  findRecettes,
  updateRecette,
  findRecette,
  getUserAuthor,
  getClients,
  getMaterials,
  getRestaurant,
};
