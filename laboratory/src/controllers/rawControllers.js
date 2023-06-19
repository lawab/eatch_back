
const rawService = require('../services/rawServices');
const laboratoryService = require('../services/LaboratoryServices');
const api_consumer = require('../services/api_consumer');




//Create Raw in Data Base
const createRaw = async (req, res) =>{

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
        // const subjectRaw = {
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
        body.provider = body.providerId;
        
        console.log("THE USER:");

        const raw = await rawService.createRaw(body);
        console.log("PASS 3########");
        // if(subjectRaw.laboratorys){
        //     subjectRaw.laboratorys.push(laboratory);
        // }
        // else{
        //     subjectRaw.laboratorys.push(laboratory);
        // }
        const laboratoryUpdated = await laboratoryService.addRawToLaboratoryById(laboratory.id, raw.id)
        console.log("PASS 4########");
        const providerBody = {
          provider: body.providerId,
          raw: raw.id,
          grammage: raw.available,
          date_provider: Date.now(),
        };
        const providing = await laboratoryService.providingLaboratoryById(laboratory.id, providerBody)
        console.log("PASS 5########");
        res.status(200).json({ "message": "Raw created successfuly!!!" });

    }
    catch(error){
        res.status(500).json({"message" : "Error encounterd creating Raw!!!"});
    };

}

//Update Raw in Data Base
const updateRaw = async (req, res) =>{

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
        const raw = await rawService.updateRawById(req.params.rawId, body);
        res.status(200).json({"message" : "Raw updated successfuly!!!"});
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Error encounterd creating laboratory!!!"});
    }
}

//Delete Raw in Data Base
const deleteRaw = async (req, res) =>{
    // const body = JSON.parse(req.headers.body);
    //  if(req.file){
    //      body.image = "/datas/"+req.file.filename;
    //  }
     try{
         
         // body.creator = creator;
         const laboratory = await rawService.deleteRawById(req.params.rawId);
         res.status(200).json({"message" : "Raw deleted successfuly!!!"});
     }
     catch(err){
         console.log(err)
         res.status(500).json({"message" : "Error encounterd creating course!!!"});
     }
 }

//Get a Raw in Data Base
const getRaw = async (req, res) =>{
    
    try{
        // const user = await api_consumer.getUserById(body.creator, req.token);
        // if(!user){
        //     res.status(401).json({"message" : "User not authenticated!!!"});
        // }
        const laboratory = await laboratoryService.getRawById(req.params.laboratoryId);
        res.status(200).json(laboratory);
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Raw not exist in DB!!!"});
    }
}

//Get a Raw By Laboratory in Data Base
const getRawLaboratory = async (req, res) =>{
    
    try{
        // const user = await api_consumer.getUserById(body.creator, req.token);
        // if(!user){
        //     res.status(401).json({"message" : "User not authenticated!!!"});
        // }
        const laboratory = await rawService.getRawByLaboratoryId(req.params.laboratoryId);
        res.status(200).json(laboratory);
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Raw not exist in DB!!!"});
    }
}

//Get All Raws in Data Base
const getRaws = async (req, res) =>{
    
    try{
        // const user = await api_consumer.getUserById(body.creator, req.token);
        // if(!user){
        //     res.status(401).json({"message" : "User not authenticated!!!"});
        // }
        const laboratorys = await rawService.getRaws();
        res.status(200).json(laboratorys);
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Raws not exist in DB!!!"});
    }
}

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
    createRaw,
    updateRaw,
    getRaw,
    getRaws,
    getRawLaboratory,
    deleteRaw
}
