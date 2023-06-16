
const Provider = require('../models/providers');


const createProvider = async (providerBody) => {
    return Provider.create(providerBody);
};

const getProviderById = async(providerId) =>{
  const provider = await Provider.findById(providerId)
  return provider;
};

const getProviders = async () => {
  const providers = await Provider.find();
  return providers;
};

const getProviderByLaboratoryId = async (laboratoryId) =>{
  const providers = await Provider.find({laboratory: laboratoryId});
  return providers;
}

//Update Provider by Id
const updateProviderById = async (providerId, providerBody) =>{

  console.log("Provider Id: ")
  console.log(providerId)
  console.log("BOOODDDYYYY: ")
  console.log(providerBody)
  const provider = await Provider.findByIdAndUpdate(
      providerId,
      {$set: providerBody},
      {new: true}
  );
  return provider;
}

const deleteProviderById = async (providerId)=>{
  const provider = await Provider.findById(providerId);
  provider.deletedAt=Date.now();
  provider.save();
  return provider;
}

const updateProviderCommentsById = async (providerId, updateBody) =>{
  const provider = await Provider.findById(providerId);
  if(provider){
    provider.comments? provider.comments.push(updateBody): provider.comments=[updateBody];
    provider.save();
  }
  
  return provider;
}
//Validate the comment by Comment Id
const validateCommentById = async(providerId, commentId) => {
  const provider = await Provider.findById(providerId);
  if(provider){
    provider.comments.map((item)=>{
      if(item.id == commentId){
        item.validated = 'true';
      }

    });
    provider.save();
  }
  
  return provider;
}
//Close the comment by Comment Id
const lockCommentById = async(providerId, commentId) => {
  const provider = await Provider.findById(providerId);
  if(provider){
    provider.comments.map((item)=>{
      if(item.id == commentId){
        item.validated = 'false';
      }

    });
    provider.save();
  }

  
  return provider;
}

//Add Provider Into Laboratory by Id
const addHomeworkToProviderById = async (providerId, homeworkId) =>{

  const provider = await Provider.findById(providerId);
  if(provider){
    provider.homeworks? provider.homeworks.push(homeworkId) : provider.homeworks = [homeworkId];
    provider.save();
  }
  return provider;
}

const validatedCommentByProviderId = async (providerIs) =>{
  
}




  module.exports = {
    createProvider,
    getProviderById,
    deleteProviderById,
    getProviderByLaboratoryId,
    updateProviderCommentsById,
    validateCommentById,
    lockCommentById,
    updateProviderById,
    addHomeworkToProviderById,
    getProviders,
  };