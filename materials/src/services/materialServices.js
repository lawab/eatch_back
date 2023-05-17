const { default: axios } = require("axios");
const { Material } = require("../models/material/material");

/**
 *
 * @param {Object} materialBody [Body to create new material in database]
 * @returns {Promise}
 */
const createMaterial = async (materialBody = {}) => {
  const material = await Material.create(materialBody);
  return material;
};
/**
 *
 * @param {Object} query [query to find one material in database]
 * @returns {Promise}
 */
const findOneMaterial = async (query = {}) => {
  const material = await Material.findOne(query);
  return material;
};
/**
 *
 * @param {Object} query [query to delete one material in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const material = await Material.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return material;
};
/**
 *
 * @param {Object} query [query to get Materials in database]
 * @returns {Promise}
 */
const findMaterials = async (query = null) => {
  const Materials = await Material.find(query);
  return Materials;
};
/**
 *
 * @param {Object} query [query to get Materials in database]
 * @returns {Promise}
 */
const findMaterial = async (query = null) => {
  const material = await Material.findOne(query);
  return material;
};

/**
 *
 * @param {Object} query [query to update Materials in database]
 * @param {Object} bodyUpdate [body to update Materials in database]
 * @returns {Promise}
 */
const updateMaterial = async (query = null, bodyUpdate = {}) => {
  const material = await Material.findOneAndUpdate(
    query,
    { ...bodyUpdate },
    { new: true }
  );
  return material;
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
 * @param {String} id [id from creator who created user]
 * @param {Object} bodyUpdate [body to update historical]
 * @returns {Promise<Object>}
 */
const addMaterialToHistorical = async (id = null, bodyUpdate = {}, token) => {
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
 * @param {Object} query [query to find material in documents list. Default value is {}]
 * @returns {Promise}
 */
const deleteTrustlyMaterial = async (query = {}) => {
  const material = await Material.deleteOne(query);
  return material;
};

module.exports = {
  createMaterial,
  findOneMaterial,
  deleteOne,
  findMaterials,
  updateMaterial,
  getUserAuthor,
  findMaterial,
  getRestaurant,
  addMaterialToHistorical,
  deleteTrustlyMaterial,
};
