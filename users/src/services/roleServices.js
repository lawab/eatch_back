const { default: Role } = require("../models/role/role");
const axios = require("axios");
/**
 *
 * @param {Object} roleBody [body to create role. default value is {}]
 * @returns {Promise}
 */
const createRole = async (roleBody = {}) => {
  const role = await Role.create(roleBody);
  return role;
};
/**
 *
 * @param {Object} query [query to find role in documents list. Default value is {}]
 * @returns {Promise}
 */
const findRole = async (query = {}) => {
  const role = await Role.findOne(query);
  return role;
};

const findRoles = async (query = {}) => {
  const users = await Role.find(query);
  return users;
};
/**
 *
 * @param {Object} query [query to find role in documents list. Default value is {}]
 * @param {Object} updateBody [body to update document. Default value is {}]
 * @returns {Promise}
 */
const deleteRole = async (query = {}, updateBody = {}) => {
  const role = await Role.findOneAndUpdate(
    query,
    { deletedAt: Date.now(), ...updateBody },
    { new: true } //tell mongoose to return the update document
  );
  return role;
};
/**
 *
 * @param {Object} query [query to update role in documents list. Default value is {}]
 * @param {Object} updateBody [body to update document. Default value is {}]
 * @returns {Promise}
 */
const updateRole = async (query = {}, updateBody = {}) => {
  const role = await Role.findOneAndUpdate(
    query,
    { ...updateBody },
    { new: true } //tell mongoose to return the update document
  );
  return role;
};
/**
 *
 * @param {Number} id [id from restaurant will fetch]
 * @param {String} token [token to valid session of role authenticated]
 * @returns {Promise}
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

module.exports = {
  createRole,
  findRole,
  findRoles,
  deleteRole,
  updateRole,
  getRestaurant,
};
