const {
  default: EmployerType,
} = require("../models/employertype/employerType");
const axios = require("axios");
/**
 *
 * @param {Object} EmployerTypeBody [body to create user. default value is {}]
 * @returns {Promise}
 */
const createEmployerType = async (EmployerTypeBody = {}) => {
  const employerType = await EmployerType.create(EmployerTypeBody);
  return employerType;
};
/**
 *
 * @param {Object} query [query to find user in documents list. Default value is {}]
 * @returns {Promise}
 */
const findEmployerType = async (query = {}) => {
  const user = await EmployerType.findOne(query);
  return user;
};

const findEmployerTypes = async (query = {}) => {
  const users = await EmployerType.find(query);
  return users;
};
/**
 *
 * @param {Object} query [query to find user in documents list. Default value is {}]
 * @param {Object} updateBody [body to update document. Default value is {}]
 * @returns {Promise}
 */
const deleteEmployerType = async (query = {}, updateBody = {}) => {
  const user = await EmployerType.findOneAndUpdate(
    query,
    { deletedAt: Date.now(), ...updateBody },
    { new: true } //tell mongoose to return the update document
  );
  return user;
};
/**
 *
 * @param {Object} query [query to update user in documents list. Default value is {}]
 * @param {Object} updateBody [body to update document. Default value is {}]
 * @returns {Promise}
 */
const UpdateEmployerType = async (query = {}, updateBody = {}) => {
  const user = await EmployerType.findOneAndUpdate(
    query,
    { ...updateBody },
    { new: true } //tell mongoose to return the update document
  );
  return user;
};
/**
 *
 * @param {Number} id [id from restaurant will fetch]
 * @param {*} token [token to valid session of user authenticated]
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
  createEmployerType,
  findEmployerType,
  deleteEmployerType,
  UpdateEmployerType,
  findEmployerTypes,
  getRestaurant,
};
