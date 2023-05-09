const { default: User } = require("../models/user/users");
const axios = require("axios");
/**
 *
 * @param {Object} userBody [body to create user. default value is {}]
 * @returns {Promise}
 */
const createUser = async (userBody = {}) => {
  const user = await User.create(userBody);
  return user;
};
/**
 *
 * @param {Object} query [query to find user in documents list. Default value is {}]
 * @returns {Promise}
 */
const findUser = async (query = {}) => {
  const user = await User.findOne(query);
  return user;
};

const findUsers = async (query = {}) => {
  const users = await User.find(query);
  return users;
};
/**
 *
 * @param {Object} query [query to find user in documents list. Default value is {}]
 * @param {Object} updateBody [body to update document. Default value is {}]
 * @returns {Promise}
 */
const deleteUser = async (query = {}, updateBody = {}) => {
  const user = await User.findOneAndUpdate(
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
const UpdateUser = async (query = {}, updateBody = {}) => {
  const user = await User.findOneAndUpdate(
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
  createUser,
  findUser,
  deleteUser,
  UpdateUser,
  findUsers,
  getRestaurant,
};
