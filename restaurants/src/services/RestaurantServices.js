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

const getRestaurantById = async (restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId);
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

/**
 *
 * @param {String} id [id from creator who created user]
 * @param {Object} bodyUpdate [body to update historical]
 * @returns {Promise<Object>}
 */
const addRetaurantToHistorical = async (id = null, bodyUpdate = {}, token) => {
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

//Request Material by Id
const requestMaterialById = async (requestBody) => {
  const restaurant = await Restaurant.findById(requestBody.restaurantId);
  // console.log("Request Id: ");
  // console.log(requestBody.restaurantId);
  if (restaurant.providings) {
    restaurant.providings.push(requestBody);
    // console.log("Request providing: ");
    // console.log(restaurant);
  }
  else {
    restaurant.providings = [requestBody];
    // console.log("Request No providing: ");
    // console.log(restaurant);
  }
  restaurant.save()
  // console.log("Restaurant saved***********: ");
  // console.log(restaurant);
  return restaurant
};

//Request Material by Id
const validateOrAcceptMaterialById = async (restaurantId, requestBody) => {

  console.log("VALIDATE BODY##############@@@@@@@@@@@@@@@@: ");
  console.log(requestBody);
  console.log("##############@@@@@@@@@@@@@@@@VALIDATE BODY##############@@@@@@@@@@@@@@@@: ");
  const restaurant = await Restaurant.findById(restaurantId);
  if (restaurant.providings) {
    const providings = restaurant.providings
    let test = false
    let i = 0
    while (test == false && i < providings.length) {
      if (providings[i]._id == requestBody.requestId) {
        providings[i].validated = requestBody.validated
        providings[i].date_validated = requestBody.date_validated
        test = true
        console.log("Restaurant ******BEFORE SAVED***********: ");
        console.log(restaurant);
        restaurant.save()
      }
      i++
    }
    console.log("Restaurant saved***********: ");
    console.log(restaurant);
    return restaurant;
  }
  
};


module.exports = {
  createRestaurant,
  findOnerestaurant,
  deleteOne,
  findRestaurants,
  updateRestaurant,
  findRestaurant,
  getUserAuthor,
  addRetaurantToHistorical,
  requestMaterialById,
  validateOrAcceptMaterialById,
  getRestaurantById,
  //getClients,
  //getProducts,
};
