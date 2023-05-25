const { default: axios } = require("axios");
const { Product } = require("../models/product/product");

/**
 *
 * @param {Object} productBody [Body to create new product in database]
 * @returns {Promise}
 */
const createProduct = async (productBody = {}) => {
  const product = await Product.create(productBody);
  return product;
};
/**
 *
 * @param {Object} query [query to find one product in database]
 * @returns {Promise}
 */
const findOneProduct = async (query = {}) => {
  const product = await Product.findOne(query);
  return product;
};
/**
 *
 * @param {Object} query [query to delete one product in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const product = await Product.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return product;
};
/**
 *
 * @param {Object} query [query to get products in database]
 * @returns {Promise}
 */
const findProducts = async (query = null) => {
  const products = await Product.find(query);
  return products;
};
/**
 *
 * @param {Object} query [query to get products in database]
 * @returns {Promise}
 */
const findProduct = async (query = null) => {
  const product = await Product.findOne(query);
  return product;
};

/**
 *
 * @param {Object} query [query to update products in database]
 * @param {Object} bodyUpdate [body to update products in database]
 * @returns {Promise}
 */
const updateProduct = async (query = null, bodyUpdate = {}) => {
  const product = await Product.findOneAndUpdate(
    query,
    { ...bodyUpdate },
    { new: true }
  );
  return product;
};

// get creator since microservice users
/**
 *
 * @param {Number} id [id to find author in database from eatch_users microservice]
 * @param {String} token [token to valid the session of author before to fetch him in database]
 * @returns {Promise} [return the current author send by eatch_users microservice]
 */
const getUserAuthor = async (id = null, token = null) => {
  console.log({ id });
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
 * @param {*} token [token to valid the session of user]
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
 * @param {Number} id [id to find categories in database from eatch_category microservice]
 * @param {String} token [token to valid the session of user]
 * @returns {Promise<[Object]>} [return the current category send by eatch_category microservice]
 */
const getCategory = async (id = null, token = null) => {
  console.log("test", id, {
    url: `${process.env.APP_URL_CATEGORY}/fetch/one/${id}`,
  });
  let { data: category } = await axios.get(
    `${process.env.APP_URL_CATEGORY}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return category;
};

/**
 *
 * @param {Array<String>} ids [list of ObjectID from materials will fetch in eatch_materials microservice]
 * @param {String} token [token to valid the session authentification of user  ]
 * @returns {Promise<Array<Object>>} [return the array of materials send by eatch_materials microservice ]
 */
const getMaterials = async (ids = [], token = null) => {
  let { data: categories } = await axios.get(
    `${process.env.APP_URL_MATERIAL}/fetch/all/${JSON.stringify(ids)}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return categories;
};

/**
 *
 * @param {String} id [id from creator who created user]
 * @param {Object} bodyUpdate [body to update historical]
 * @returns {Promise<Object>}
 */
const addProductToHistorical = async (id = null, bodyUpdate = {}, token) => {
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
 * @param {Object} query [query to find product in documents list. Default value is {}]
 * @returns {Promise}
 */
const deleteTrustlyProduct = async (query = {}) => {
  const product = await Product.deleteOne(query);
  return product;
};

/**
 *
 * @param {String} token [token to valid the session of user]
 * @returns {Promise<[Object]>} [return the current categories send by eatch_category microservice]
 */
const getCategories = async (token = null) => {
  let { data: categories } = await axios.get(
    `${process.env.APP_URL_CATEGORY}/fetch/all`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return categories;
};

const getProductsByCategories = () => {
  let products = Product.aggregate([
    {
      $group: {
        _id: "$category.title",
        products: { $push: "$$ROOT" },
      },
    },
  ]);

  return products;
};

// const getProductsByCategoriesAndRestaurant = (restaurantId) => {
//   let products = Product.aggregate([

//     {
//       $group: {
//         _id: "$category.title",
//         products: { $push: "$$ROOT" },
//       },
//     },
//   ]);

//   console.log({ products: products._pipeline });

//   return products;
// };

module.exports = {
  createProduct,
  findOneProduct,
  deleteOne,
  findProducts,
  updateProduct,
  getUserAuthor,
  findProduct,
  getRestaurant,
  getCategory,
  getMaterials,
  addProductToHistorical,
  deleteTrustlyProduct,
  getCategories,
  getProductsByCategories,
  // getProductsByCategoriesAndRestaurant,
};
