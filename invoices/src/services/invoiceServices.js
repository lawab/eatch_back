const { default: axios } = require("axios");
const { Invoice } = require("../models/invoice/invoice");

/**
 *
 * @param {Object} invoiceBody [Body to create new invoice in database]
 * @returns {Promise}
 */
const createInvoice = async (invoiceBody = {}) => {
  const invoice = await Invoice.create(invoiceBody);
  return invoice;
};
/**
 *
 * @param {Object} query [query to find one invoice in database]
 * @returns {Promise}
 */
const findOneInvoice = async (query = {}) => {
  const invoice = await Invoice.findOne(query);
  return invoice;
};
/**
 *
 * @param {Object} query [query to delete one invoice in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const invoice = await Invoice.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return invoice;
};
/**
 *
 * @param {Object} query [query to get Materials in database]
 * @returns {Promise}
 */
const findInvoices = async (query = null) => {
  const invoices = await Invoice.find(query);
  return invoices;
};
/**
 *
 * @param {Object} query [query to get Materials in database]
 * @returns {Promise}
 */
const findInvoice = async (query = null) => {
  const invoice = await Invoice.findOne(query);
  return invoice;
};

/**
 *
 * @param {Object} query [query to update Materials in database]
 * @param {Object} bodyUpdate [body to update Materials in database]
 * @returns {Promise}
 */
const updateInvoice = async (query = null, bodyUpdate = {}) => {
  const invoice = await Invoice.findOneAndUpdate(
    query,
    { ...bodyUpdate },
    { new: true }
  );
  return invoice;
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
 * @param {string} id [_id products that we want to get in database]
 * @param {String} token [token to authenticate user]
 * @returns {Promise<Object>} [Array of products found in database]
 */
const getOrder = async (id = null, token = null) => {
  let { data: products } = await axios.get(
    `${process.env.APP_URL_ORDER}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return products;
};

/**
 * @param {Number} id [id of order that we want to update]
 * @param {Object} order [body to update order]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Object>}
 */
const updateOrder = async (id = null, bodyUpdate = {}, token = null) => {
  try {
    let { data: order } = await axios.put(
      `${process.env.APP_URL_ORDER}/update/${id}`,
      { ...bodyUpdate },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return order;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 *
 * @param {String} id [ObjectId to find restaurant in database]
 * @param {String} token  [token to authenticated user before continuous treatment of his request ]
 * @returns {Promise<Object>}
 */
const getRestaurant = async (id = null, token = null) => {
  try {
    let { data: restaurant } = await axios.get(
      `${process.env.APP_URL_RESTAURANT}/fetch/one/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return restaurant;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {String} id [id from creator who created user]
 * @param {Object} bodyUpdate [body to update historical]
 * @returns {Promise<Object>}
 */
const addInvoiceToHistorical = async (id = null, bodyUpdate = {}, token) => {
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
 * @param {Object} query [query to find invoice in documents list. Default value is {}]
 * @returns {Promise}
 */
const deleteTrustlyInvoice = async (query = {}) => {
  const invoice = await Invoice.deleteOne(query);
  return invoice;
};

const updateOrderRemote = async (id, bodyUpdated, token) => {
  let { data: response } = await axios.put(
    `${process.env.APP_URL_ORDER}/update/remote/${id}`,
    { data: bodyUpdated },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

const decrementQuantityFromRemoteProducts = async (products = [], token) => {
  let { data: response } = await axios.put(
    `${process.env.APP_URL_PRODUCTS}/decrement`,
    { products },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

const incrementQuantityFromRemoteProducts = async (products = [], token) => {
  let { data: response } = await axios.put(
    `${process.env.APP_URL_PRODUCTS}/increment`,
    { products },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

const getRemoteMaterialsFromProducts = async (ids, token) => {
  let { data: response } = await axios.get(
    `${process.env.APP_URL_PRODUCTS}/fetch/all/materials/${JSON.stringify(
      ids
    )}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

const decrementRemoteMaterials = async (body, token) => {
  let { data: response } = await axios.put(
    `${process.env.APP_URL_MATERIAL}/decrement`,
    { ...body },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

module.exports = {
  createInvoice,
  findOneInvoice,
  deleteOne,
  findInvoices,
  updateInvoice,
  getUserAuthor,
  findInvoice,
  getOrder,
  updateOrder,
  getRestaurant,
  addInvoiceToHistorical,
  deleteTrustlyInvoice,
  updateOrderRemote,
  decrementQuantityFromRemoteProducts,
  incrementQuantityFromRemoteProducts,
  getRemoteMaterialsFromProducts,
  decrementRemoteMaterials,
};
