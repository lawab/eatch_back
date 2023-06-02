const Laboratory = require("../models/laboratory");
//const Restaurant = require("../models/laboratory");
const { default: axios } = require("axios");
//const { default: Order } = require("../models/order/order");

/**
 *
 * @param {Object} laboratoryBody [Body to create new Laboratory in database]
 * @returns {Promise}
 */

const createLaboratory = async (laboratoryBody = {}) => {
  const laboratory = await Laboratory.create(laboratoryBody);
  return laboratory;
};
/**
 *
 * @param {Object} query [query to find one Laboratory in database]
 * @returns {Promise}
 */
const findOneLaboratory = async (query = {}) => {
  const laboratory = await Laboratory.findOne(query);
  return laboratory;
};
/**
 *
 * @param {Object} query [query to delete one Laboratory in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const laboratory = await Laboratory.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return laboratory;
};
/**
 *
 * @param {Object} query [query to get Laboratory in database]
 * @returns {Promise}
 */
const findLaboratories = async (query = null) => {
  const laboratories = await Laboratory.find(query);
  return laboratories;
};
/**
 *
 * @param {Object} query [query to Laboratory in database]
 * @returns {Promise}
 */
const findLaboratory = async (query = null) => {
  const laboratory = await Laboratory.findOne(query);
  return laboratory;
};
/**
 *
 * @param {Object} query [query to update Laboratorys in database]
 * @param {Object} bodyUpdate [body to update Laboratorys in database]
 * @returns {Promise}
 */
const updateLaboratory = async (id, bodyUpdate = {}) => {
  const laboratory = await Laboratory.findByIdAndUpdate(
    id,
    { ...bodyUpdate },
    { new: true }
  );
  return laboratory;
};

const addProviderById = async (laboId, bodyProvided = {}) => {
  const laboratory = await Laboratory.findById(laboId);
  laboratory.providers.push(bodyProvided);
  laboratory.save();
  return laboratory;
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

const getMaterials = async (id = null, token = null) => {
  console.log({ token });
  let { data: material } = await axios.get(
    `${process.env.APP_URL_MATERIAL}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return material;
};

/**
 *
 * @param {String} id [id from creator who created user]
 * @param {Object} bodyUpdate [body to update historical]
 * @returns {Promise<Object>}
 */
const addLaboratoryToHistorical = async (id = null, bodyUpdate = {}, token) => {
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

module.exports = {
  createLaboratory,
  findOneLaboratory,
  deleteOne,
  findLaboratories,
  updateLaboratory,
  findLaboratory,
  getUserAuthor,
  getRestaurant,
  addLaboratoryToHistorical,
  addProviderById,
  getMaterials,
  //getProducts,
};
