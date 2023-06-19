
const materialService = require('../services/materialServices');
const laboratoryService = require('../services/LaboratoryServices');
const api_consumer = require('../services/api_consumer');




//Create Material in Data Base
const createMaterial = async (req, res) =>{

    try {
        const body = JSON.parse(req.headers.body);
        console.log("ENTER########");
        console.log(body);
        body.image = req.file ? "/datas/" + req.file.filename : "";
        const token = req.token;
        const user = await api_consumer.getUserById(body._creator, req.token);
        if(!user){
            console.log("User not authenticated!!!")
            return res.status(401).json({"message" : "User not authenticated!!!"});
        }
        console.log("PASS 1########")
        const laboratory = await laboratoryService.getLaboratoryById(body.laboratoryId);
        if(!laboratory){
            console.log("Laboratory not found!!!")
            return res.status(401).json({"message" : "Laboratory not found!!!"});
        }
        // const subjectMaterial = {
        //     _id: subject.data._id,
        //     title: subject.data.title,
        //     description: subject.data.description,
        // }
        console.log("PASS 2########");
        const creator = {
            _id: user.data._id,
            email: user.data.email,
            role: user.data.role,
            fullName: user.data.fullName,
            firstName: user.data.firstName,
            lastName: user.data.lastName
        }
        body.creator = creator;
        body.laboratory = laboratory.id;
        
        console.log("THE USER:");

        const material = await materialService.createMaterial(body);
        console.log("PASS 3########");
        // if(subjectMaterial.laboratorys){
        //     subjectMaterial.laboratorys.push(laboratory);
        // }
        // else{
        //     subjectMaterial.laboratorys.push(laboratory);
        // }
        const laboratoryUpdated = await laboratoryService.addMaterialToLaboratoryById(laboratory.id, material.id)
        console.log("PASS 4########");
        const manufacturingBody = {
          material: material.id,
          qte: material.quantity,
          date_provider: Date.now(),
        };
        const manufacturing = await laboratoryService.manufacturingLaboratoryById(laboratory.id, manufacturingBody)
        console.log("PASS 5########");
        res.status(200).json({ "message": "Material created successfuly!!!" });

    }
    catch(error){
        res.status(500).json({"message" : "Error encounterd creating Material!!!"});
    };

}

//Update Material in Data Base
const updateMaterial = async (req, res) =>{

    const body = JSON.parse(req.headers.body);
    
    if(req.file){
        body.image = "/datas/" + req.file.filename;
    }
    try{
        const user = await api_consumer.getUserById(body.creator, req.token);
        if(!user){
           return res.status(401).json({"message" : "User not authenticated!!!"});
        }
        const creator = {
            _id: user.data._id,
            email: user.data.email,
            role: user.data.role,
            fullName: user.data.fullName,
            firstName: user.data.firstName,
            lastName: user.data.lastName
        }
        body.creator = creator;
        const material = await materialService.updateMaterialById(req.params.materialId, body);
        res.status(200).json({"message" : "Material updated successfuly!!!"});
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Error encounterd creating laboratory!!!"});
    }
}

//Delete Material in Data Base
const deleteMaterial = async (req, res) =>{
    // const body = JSON.parse(req.headers.body);
    //  if(req.file){
    //      body.image = "/datas/"+req.file.filename;
    //  }
     try{
         
         // body.creator = creator;
         const laboratory = await materialService.deleteMaterialById(req.params.materialId);
         res.status(200).json({"message" : "Material deleted successfuly!!!"});
     }
     catch(err){
         console.log(err)
         res.status(500).json({"message" : "Error encounterd creating course!!!"});
     }
 }

//Get a Material in Data Base
const getMaterial = async (req, res) =>{
    
    try{
        // const user = await api_consumer.getUserById(body.creator, req.token);
        // if(!user){
        //     res.status(401).json({"message" : "User not authenticated!!!"});
        // }
        const material = await materialService.getMaterialById(
          req.params.materialId
        );
        res.status(200).json(material);
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Material not exist in DB!!!"});
    }
}

//Get a Material By Laboratory in Data Base
const getMaterialLaboratory = async (req, res) =>{
    
    try{
        // const user = await api_consumer.getUserById(body.creator, req.token);
        // if(!user){
        //     res.status(401).json({"message" : "User not authenticated!!!"});
        // }
        const laboratory = await materialService.getMaterialByLaboratoryId(req.params.laboratoryId);
        res.status(200).json(laboratory);
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Material not exist in DB!!!"});
    }
}

//Get All Materials in Data Base
const getMaterials = async (req, res) =>{
    
    try{
        // const user = await api_consumer.getUserById(body.creator, req.token);
        // if(!user){
        //     res.status(401).json({"message" : "User not authenticated!!!"});
        // }
        const laboratorys = await materialService.getMaterials();
        res.status(200).json(laboratorys);
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Materials not exist in DB!!!"});
    }
}

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
    createMaterial,
    updateMaterial,
    getMaterial,
    getMaterials,
    getMaterialLaboratory,
    deleteMaterial
}
