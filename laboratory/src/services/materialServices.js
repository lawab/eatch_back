
const Material = require('../models/materials');


const createMaterial = async (materialBody) => {
    return Material.create(materialBody);
};

const getMaterialById = async(materialId) =>{
  const material = await Material.findById(materialId)
  return material;
};

const getMaterials = async () => {
  const materials = await Material.find();
  return materials;
};

const getMaterialByLaboratoryId = async (laboratoryId) =>{
  const materials = await Material.find({laboratory: laboratoryId});
  return materials;
}

//Update Material by Id
const updateMaterialById = async (materialId, materialBody) =>{

  // console.log("Material Id: ")
  // console.log(materialId)
  // console.log("BOOODDDYYYY: ")
  // console.log(materialBody)
  const material = await Material.findByIdAndUpdate(
      materialId,
      {$set: materialBody},
      {new: true}
  );
  return material;
}

const deleteMaterialById = async (materialId)=>{
  const material = await Material.findById(materialId);
  material.deletedAt=Date.now();
  material.save();
  return material;
}

const updateMaterialCommentsById = async (materialId, updateBody) =>{
  const material = await Material.findById(materialId);
  if(material){
    material.comments? material.comments.push(updateBody): material.comments=[updateBody];
    material.save();
  }
  
  return material;
}
//Validate the comment by Comment Id
const validateCommentById = async(materialId, commentId) => {
  const material = await Material.findById(materialId);
  if(material){
    material.comments.map((item)=>{
      if(item.id == commentId){
        item.validated = 'true';
      }

    });
    material.save();
  }
  
  return material;
}
//Close the comment by Comment Id
const lockCommentById = async(materialId, commentId) => {
  const material = await Material.findById(materialId);
  if(material){
    material.comments.map((item)=>{
      if(item.id == commentId){
        item.validated = 'false';
      }

    });
    material.save();
  }

  
  return material;
}

//Add Material Into Laboratory by Id
const addHomeworkToMaterialById = async (materialId, homeworkId) =>{

  const material = await Material.findById(materialId);
  if(material){
    material.homeworks? material.homeworks.push(homeworkId) : material.homeworks = [homeworkId];
    material.save();
  }
  return material;
}

const validatedCommentByMaterialId = async (materialIs) =>{
  
}




  module.exports = {
    createMaterial,
    getMaterialById,
    getMaterials,
    deleteMaterialById,
    getMaterialByLaboratoryId,
    updateMaterialCommentsById,
    validateCommentById,
    lockCommentById,
    updateMaterialById,
    addHomeworkToMaterialById
  }