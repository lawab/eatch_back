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
 * @param {Array<String>} id [_id products that we want to get in database]
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
};
