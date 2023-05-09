/**
 *
 * @param {Object} res [Object Response from express to send response to client if necessary]
 * @param {Object} clientServices [product microservice to manage product in database]
 * @param {Object} body [Body Object from express]
 * @param {String} token [token to authenticate user session]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (clientServices, body, token) => {
  // verify the existing of restaurant in database if it's in body request before update it in database
  if (body?.restaurant) {
    // verify restaurant in database
    let restaurant = await clientServices.getRestaurant(
      body?.restaurant,
      token
    );

    if (!restaurant?._id) {
      throw new Error("Invalid data send");
    }
    body["restaurant"] = restaurant; // update restaurant with value found in database
  }

  // verify the existing of category in database if it's in body request before update it in database
  if (body?.client) {
    let client = await orderServices.getClient(body?.client, token);
    console.log({ client });

    // if client not exists in database
    if (!client?._id) {
      if (!restaurant?._id) {
        throw new Error("Invalid data send");
      }
    }
    body["client"] = client;
  }

  if (body?.client?.length) {
    // set ids list from clients
    let clientIds = body?.client;

    if (!clientIds?.length) {
      if (!restaurant?._id) {
        throw new Error("Invalid data send");
      }
    }

    // get list of clients
    let clients = await clientServices.getClients(clientIds, token);

    // if clients not exists in database
    if (!clients?.length) {
      throw new Error("Invalid data send");
    }

    body["clients"] = clients;
  }

  return body;
};
