
const Raw = require('../models/raw_material');


const createRaw = async (rawBody) => {
    return Raw.create(rawBody);
};

const getRawById = async(rawId) =>{
  const raw = await Raw.findById(rawId)
  return raw;
};

const getRawByLaboratoryId = async (laboratoryId) =>{
  const raws = await Raw.find({laboratory: laboratoryId});
  return raws;
}

//Update Raw by Id
const updateRawById = async (rawId, rawBody) =>{

  console.log("Raw Id: ")
  console.log(rawId)
  console.log("BOOODDDYYYY: ")
  console.log(rawBody)
  const raw = await Raw.findByIdAndUpdate(
      rawId,
      {$set: rawBody},
      {new: true}
  );
  return raw;
}

const deleteRawById = async (rawId)=>{
  const raw = await Raw.findById(rawId);
  raw.deletedAt=Date.now();
  raw.save();
  return raw;
}

const updateRawCommentsById = async (rawId, updateBody) =>{
  const raw = await Raw.findById(rawId);
  if(raw){
    raw.comments? raw.comments.push(updateBody): raw.comments=[updateBody];
    raw.save();
  }
  
  return raw;
}
//Validate the comment by Comment Id
const validateCommentById = async(rawId, commentId) => {
  const raw = await Raw.findById(rawId);
  if(raw){
    raw.comments.map((item)=>{
      if(item.id == commentId){
        item.validated = 'true';
      }

    });
    raw.save();
  }
  
  return raw;
}
//Close the comment by Comment Id
const lockCommentById = async(rawId, commentId) => {
  const raw = await Raw.findById(rawId);
  if(raw){
    raw.comments.map((item)=>{
      if(item.id == commentId){
        item.validated = 'false';
      }

    });
    raw.save();
  }

  
  return raw;
}

//Add Raw Into Laboratory by Id
const addHomeworkToRawById = async (rawId, homeworkId) =>{

  const raw = await Raw.findById(rawId);
  if(raw){
    raw.homeworks? raw.homeworks.push(homeworkId) : raw.homeworks = [homeworkId];
    raw.save();
  }
  return raw;
}

const validatedCommentByRawId = async (rawIs) =>{
  
}




  module.exports = {
    createRaw,
    getRawById,
    deleteRawById,
    getRawByLaboratoryId,
    updateRawCommentsById,
    validateCommentById,
    lockCommentById,
    updateRawById,
    addHomeworkToRawById
  }