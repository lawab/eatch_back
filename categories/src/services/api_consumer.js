const { default: axios } = require("axios");
const config = require("../../src/configs/config");

const getUserById = async (userId, token) => {
  console.log("*******USER ID: " + userId);
  console.log("*******URL: " + config.url_user + `/fetch/one/${userId}`);
  try {
    const user = await axios.get(config.url_user + `/fetch/one/${userId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    console.log("USERRRR: ");
    console.log(user.data);
    return user;
  } catch (err) {
    console.log(err.data);
    return err;
  }
};

const getRestaurantById = async (restaurantId, token) => {
  console.log("*******RESTAURANT ID: " + restaurantId);
  console.log(
    "*******URL: " + config.url_restaurant + `/fetch/one/${restaurantId}`
  );
  try {
    const { data: restaurant } = await axios.get(
      config.url_restaurant + `/fetch/one/${restaurantId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("RESTAURANT: ");
    console.log({ restaurant });
    return restaurant;
  } catch (err) {
    console.log(err.data);
    return err;
  }
};

/**
 *
 * @param {String} id [id from creator who created user]
 * @param {Object} bodyUpdate [body to update historical]
 * @returns {Promise<Object>}
 */
const addToHistorical = async (id = null, bodyUpdate = {}, token) => {
  console.log(`*******URL: ${config.url_historical}/update/${id}`);

  let response = await axios.put(
    `${config.url_historical}/update/${id}`,
    bodyUpdate,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

const getRemoteProductsByCategoriesForOneRestaurant = async (
  restaurantId,
  token
) => {
  console.log(
    `*******URL: ${config.url_product}/fetch/categories/${restaurantId}`
  );

  let { data: response } = await axios.get(
    `${config.url_product}/fetch/categories/${restaurantId}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

module.exports = {
  getUserById,
  getRestaurantById,
  addToHistorical,
  getRemoteProductsByCategoriesForOneRestaurant,
};
