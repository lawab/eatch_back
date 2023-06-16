/**
 
 * @param {Function} addElementToHistorical [callback that call historical service to store element into historical]
 * @param {Function} errorHanhler [callback which will executed if saved into historical failled]
 * @returns {Promise<Object>} [the response send by historical service]
 */
const addElementToHistorical = async (addElementToHistorical, errorHanhler) => {
  try {
    // add new user create in historical
    let response = await addElementToHistorical();

    if (response.status !== 200) {
      await errorHanhler();
    }
    return response;
  } catch (error) {
    await errorHanhler();
    console.log(error)
    throw new Error(error);
  }
};
/**
 *
 * @param {Object} response [Object response send by historical serices]
 * @param {Object} res [response Object send by express during entry of one request ]
 * @param {String} successMessage [success message to send from client]
 * @param {String} errorMessage [error message to send from client about error authorization]
 * @returns {Object} response send to client
 */
const closeRequest = (
  response,
  res,
  successMessage = "",
  errorMessage = ""
) => {
  if (response?.status === 200) {
    console.log({ response: response.data?.message });
    return res.status(200).json({ message: successMessage });
  } else {
    return res.status(401).json({ message: errorMessage });
  }
};
module.exports = {
  addElementToHistorical,
  closeRequest,
};
