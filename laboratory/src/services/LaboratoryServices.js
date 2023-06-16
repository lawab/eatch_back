const Laboratory = require("../models/laboratory");
//const Restaurant = require("../models/laboratory");
const { default: axios } = require("axios");
//const { default: Order } = require("../models/order/order");

/**
 *
 * @param {Object} laboratoryBody [Body to create new Laboratory in database]
 * @returns {Promise}
 */

const createLaboratory = async (laboratoryBody = {}) => {
  const laboratory = await Laboratory.create(laboratoryBody);
  return laboratory;
};
/**
 *
 * @param {Object} query [query to find one Laboratory in database]
 * @returns {Promise}
 */
const findOneLaboratory = async (query = {}) => {
  const laboratory = await Laboratory.findOne(query);
  return laboratory;
};

//Get category by Id
const getLaboratoryById = async (laboratoryId) => {
  const laboratory = await Laboratory.findById(laboratoryId);
  return laboratory;
};
/**
 *
 * @param {Object} query [query to delete one Laboratory in database]
 * @returns {Promise}
 */
const deleteOne = async (query = {}, bodyUpdate = {}) => {
  const laboratory = await Laboratory.findOneAndUpdate(
    query,
    { $set: { ...bodyUpdate } },
    { new: true }
  );
  return laboratory;
};
/**
 *
 * @param {Object} query [query to get Laboratory in database]
 * @returns {Promise}
 */
const findLaboratories = async (query = null) => {
  const laboratories = await Laboratory.find(query)
    .populate({ path: "raws" })
    .populate({ path: "providers" })
    .populate({ path: "materials" })
    .populate({ path: "providings" })
    .populate({ path: "manufacturings" });
  return laboratories;
};
/**
 *
 * @param {Object} query [query to Laboratory in database]
 * @returns {Promise}
 */
const findLaboratory = async (query = null) => {
  const laboratory = await Laboratory.findOne(query)
    .populate({ path: "raws" })
    .populate({ path: "providers" })
    .populate({ path: "materials" })
    .populate({ path: "providings" })
    .populate({ path: "manufacturings" });
  return laboratory;
};
/**
 *
 * @param {Object} query [query to update Laboratorys in database]
 * @param {Object} bodyUpdate [body to update Laboratorys in database]
 * @returns {Promise}
 */
const updateLaboratory = async (id, bodyUpdate = {}) => {
  const laboratory = await Laboratory.findByIdAndUpdate(
    id,
    { ...bodyUpdate },
    { new: true }
  );
  return laboratory;
};

const addProviderById = async (laboId, bodyProvided = {}) => {
  const laboratory = await Laboratory.findById(laboId);
  laboratory.providers.push(bodyProvided);
  laboratory.save();
  return laboratory;
};

// get creator since microservice users
/**
 *
 * @param {Number} id [id to find author in database from eatch_users microservice]
 * @param {String} token [token to valid the session of author before to fetch him in database]
 * @returns {Promise} [return the current author send by eatch_users microservice]
 */
const getUserAuthor = async (id = null, token = null) => {
  console.log("########### ID: ",id)
  let { data: creator } = await axios.get(
    `${process.env.APP_URL_USER}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(creator)
  return creator;
};
/**
 *
 * @param {Number} id [id to find author in database from eatch_users microservice]
 * @param {String} token [token to valid the session of author before to fetch him in database]
 * @returns {Promise} [return the current author send by eatch_users microservice]
 */

const getRestaurant = async (id = null, token = null) => {
  console.log({ token });
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

const getMaterials = async (id = null, token = null) => {
  console.log({ token });
  let { data: material } = await axios.get(
    `${process.env.APP_URL_MATERIAL}/fetch/one/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return material;
};

/**
 *
 * @param {String} id [id from creator who created user]
 * @param {Object} bodyUpdate [body to update historical]
 * @returns {Promise<Object>}
 */
const addLaboratoryToHistorical = async (id = null, bodyUpdate = {}, token) => {
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

//Add Raw Into Laboratory by Id
const addRawToLaboratoryById = async (laboratoryId, rawId) => {
  const laboratory = await Laboratory.findById(laboratoryId);
  if (laboratory) {
    laboratory.raws ? laboratory.raws.push(rawId) : (laboratory.raws = [rawId]);
    laboratory.save();
  }
  return laboratory;
};

//Add Raw Into Laboratory by Id
const addMaterialToLaboratoryById = async (laboratoryId, materialId) => {
  const laboratory = await Laboratory.findById(laboratoryId);
  if (laboratory) {
    laboratory.materials
      ? laboratory.materials.push(materialId)
      : (laboratory.materials = [materialId]);
    laboratory.save();
  }
  return laboratory;
};

//Add Provider Into Laboratory by Id
const addProviderToLaboratoryById = async (laboratoryId, providerId) => {
  const laboratory = await Laboratory.findById(laboratoryId);
  if (laboratory) {
    laboratory.providers
      ? laboratory.providers.push(providerId)
      : (laboratory.providers = [providerId]);
    laboratory.save();
  }
  return laboratory;
};

//Providing Laboratory by Id from Provider Id with Raw materials
const providingLaboratoryById = async (laboratoryId, provideBody) => {
  const laboratory = await Laboratory.findById(laboratoryId);
  provideBody.date_provider = Date.now();
  if (laboratory) {
    laboratory.providings
      ? laboratory.providings.push(provideBody)
      : (laboratory.providings = [provideBody]);
    laboratory.save();
  }
  return laboratory;
};

//Manufacturing Laboratory by Id with materials
const manufacturingLaboratoryById = async (laboratoryId, manufacturingBody) => {
  const laboratory = await Laboratory.findById(laboratoryId);
  manufacturingBody.date_manufactured = Date.now();
  if (laboratory) {
    laboratory.manufacturings
      ? laboratory.manufacturings.push(manufacturingBody)
      : (laboratory.manufacturings = [manufacturingBody]);
    laboratory.save();
  }
  return laboratory;
};

//Receive Request from Restaurant
const requestMaterialFromRestaurantById = async (laboratoryId, requestBody) => {
  // console.log("*****************************************************")
  // console.log(requestBody.body);
  // console.log("#####################################################");
  const laboratory = await Laboratory.findById(laboratoryId);
  if (laboratory) {
    if (laboratory.requestMaterials) {
      console.log("EXIST:")
      laboratory.requestMaterials.push(requestBody.body);
    }
    else {
      console.log("NOT EXIST:");
      laboratory.requestMaterials = [requestBody.body];
    }
    // laboratory.requestMaterials
    //   ? laboratory.requestMaterials.push(requestBody)
    //   : (laboratory.requestMaterials = [requestBody]);
    laboratory.save();
    // console.log("################requesttt laboratory");
    // console.log(laboratory);
    // console.log("################requesttt laboratory***************");
    return laboratory;
  }
  //  console.log("################Not found***************");
};

//Validate Request from Restaurant
const validateRequestFromRestaurantById = async (body) => {

  const laboratory = await Laboratory.findById(body.laboratoryId);
  if (laboratory) {
    if (laboratory.requestMaterials) {
      // console.log("################requesttt laboratory.requestMaterials");
      let test = false
      const materials = laboratory.requestMaterials
      let i = 0;
      while (test == false && i < materials.length) {
        if (materials[i].requestId == body.requestId) {
          materials[i].validated = true;
          if (body.choice == "refused") {
            materials[i].validated = false;
          }
          materials[i].date_validated = Date.now();
          test = true;
          laboratory.save();
          // console.log("################requesttt laboratory");
          // console.log(laboratory);
          // console.log("################requesttt laboratory***************");
        }
        i++
      }
      return laboratory;
    }
    
  }
};

module.exports = {
  createLaboratory,
  findOneLaboratory,
  deleteOne,
  findLaboratories,
  updateLaboratory,
  findLaboratory,
  getUserAuthor,
  getRestaurant,
  addLaboratoryToHistorical,
  addProviderById,
  getMaterials,
  addRawToLaboratoryById,
  addProviderToLaboratoryById,
  providingLaboratoryById,
  getLaboratoryById,
  addMaterialToLaboratoryById,
  manufacturingLaboratoryById,
  requestMaterialFromRestaurantById,
  validateRequestFromRestaurantById,
};
