const { default: mongoose } = require("mongoose");
const { fieldsRequired } = require("../models/historical/historical");
const { actionTypes } = require("../models/statusTypes");

/**
 * @author <uchokomeny@gmail.com>
 * @param {Object} historicalservices [historical service to manage historical database]
 * @param {Object} body [body that contains values which want to save in database]
 * @param {String} token [token to authenticate user before to some action]
 * @returns {Promise<Array>} [return the body updated that should be save in database]
 */
module.exports = async (historicalservices, body = {}, token) => {
  try {
    // set all field value send in body request
    let [key] = Object.keys(body);
    console.log("*****************body : ")
    console.log(body)
    let value = body[key];
    let keyService = key.charAt(0).toUpperCase() + key.slice(1, key.length - 1); // transform first letter to upperCase(example: client to Client)
    let keyMethod = `get${keyService}`;
    let method = historicalservices[keyMethod];

    console.log({ value, method, key, body });

    let valueFound = await method(value?._id, token);

    console.log({ valueFound });

    if (!valueFound?._id || !actionTypes.hasOwnProperty(value?.action)) {
      throw new Error(`invalid ${key} send`);
    }
    body[key] = {
      ...valueFound,
      action: value?.action,
    }; // set value found from specifics field required adn action required

    return body;
  } catch (error) {
    console.log(error.message, "x");
    throw new Error(error.message);
  }
};
