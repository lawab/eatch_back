const print = require("../log/print");
const { fieldsRequired } = require("../models/historical/historical");
const { actionTypes } = require("../models/statusTypes");

/**
 * @author <uchokomeny@gmail.com>
 * @param {Object} historicalservices [historical service to manage historical database]
 * @param {Object} body [body that contains values which want to save in database]
 * @param {Object} creator [the author to do current specifics action]
 * @param {String} token [token to authenticate user before to some action]
 * @returns {Promise<Array>} [return the body updated that should be save in database]
 */
module.exports = async (
  historicalservices,
  body = {},
  creator = null,
  token
) => {
  try {
    // set all field value send in body request
    for (const key in body) {
      if (
        Object.hasOwnProperty.call(body, key) &&
        fieldsRequired.includes(key)
      ) {
        let value = body[key];
        let keyService =
          key.charAt(0).toUpperCase() + key.slice(1, key.length - 1); // transform first letter to upperCase(example: client to Client)
        let keyMethod = `get${keyService}`;
        let method = historicalservices[keyMethod];

        let valueFound = await method(value?._id, token);
        if (!valueFound?._id || !actionTypes.hasOwnProperty(value?.action)) {
          throw new Error(`invalid ${key} send`);
        }
        print({ value, valueFound });
        body[key] = { action: value?.action, _creator: creator, ...valueFound }; // set value found from specifics field required adn action required
      }
    }

    return body;
  } catch (error) {
    print(error.message, "x");
  }
};
