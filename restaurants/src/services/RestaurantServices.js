const Restaurant = require("../models/restaurant");
const { default: axios } = require("axios");
//const { default: Order } = require("../models/order/order");

/**
 *
 * @param {Object} restaurantBody [Body to create new restaurant in database]
 * @returns {Promise}
 */

const createRestaurant = async (restaurantBody = {}) => {
  const restaurant = await Restaurant.create(restaurantBody);
  return restaurant;
};
/**
 *
 * @param {Object} query [query to find one restaurant in database]
 * @returns {Promise}
 */
const findOnerestaurant = async (query = {}) => {
  const restaurant = await Restaurant.findOne(query);
  return restaurant;
};
/**
 *
 * @param {Object} query [query to delete one restaurant in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const restaurant = await Restaurant.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return restaurant;
};
/**
 *
 * @param {Object} query [query to get restaurant in database]
 * @returns {Promise}
 */
const findRestaurants = async (query = null) => {
  const restaurants = await Restaurant.find(query);
  return restaurants;
};
/**
 *
 * @param {Object} query [query to restaurant in database]
 * @returns {Promise}
 */
const findRestaurant = async (query = null) => {
  const restaurant = await Restaurant.findOne(query);
  return restaurant;
};
/**
 *
 * @param {Object} query [query to update restaurants in database]
 * @param {Object} bodyUpdate [body to update restaurants in database]
 * @returns {Promise}
 */
const updateRestaurant = async (id, bodyUpdate = {}) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    id,
    { ...bodyUpdate },
    { new: true }
  );
  return restaurant;
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
/*/**
 *
 * @param {String} id [id_restaurant to find clients from restaurant in database from eatch_clients microservice]
 * @param {String} token [token to valid the session of author before to fetch him in database]
 * @returns {Promise} [return the current client (if exists) send by eatch_clients microservice]
 */
/*const getClients = async (id = null, token = null) => {
  let { data: client } = await axios.get(
    `${process.env.APP_URL_CLIENT}/fetch/restaurant/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return client;
};*/

/*const getProducts = async (ids = [], token = null) => {
  let { data: products } = await axios.get(
    `${process.env.APP_URL_PRODUCTS}/fetch/all/${JSON.stringify(ids)}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return products;
};*/

module.exports = {
  createRestaurant,
  findOnerestaurant,
  deleteOne,
  findRestaurants,
  updateRestaurant,
  findRestaurant,
  getUserAuthor,
  //getClients,
  //getProducts,
};
