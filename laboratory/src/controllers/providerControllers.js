
const providerService = require('../services/providerServices');
const laboratoryService = require('../services/LaboratoryServices');
const api_consumer = require('../services/api_consumer');




//Create Provider in Data Base
const createProvider = async (req, res) => {
   
    try {
        console.log("BOOOODDDDDDYYYY: ");
        const body = JSON.parse(req.headers.body);
        if (req.file) {
          body.file = "/datas/" + req.file.filename;
        }
        const token = req.token;
        console.log("BOOOODDDDDDYYYY: ");
        console.log(body);
        const user = await api_consumer.getUserById(body._creator, req.token);
        if(!user){
            console.log("User not authenticated!!!")
            return res.status(401).json({"message" : "User not authenticated!!!"});
        }
        const laboratory = await laboratoryService.findOneLaboratory(body.laboratoryId);
        if(!laboratory){
            console.log("Laboratory not found!!!")
            return res.status(401).json({"message" : "Laboratory not found!!!"});
        }
        // const subjectProvider = {
        //     _id: subject.data._id,
        //     title: subject.data.title,
        //     description: subject.data.description,
        // }
        const creator = {
            _id: user.data._id,
            email: user.data.email,
            role: user.data.role,
            fullName: user.data.fullName,
            firstName: user.data.firstName,
            lastName: user.data.lastName
        }
        body._creator = creator;
        body.laboratory = laboratory.id;
        //body.creator = user.data;
        
        console.log("THE USER:");

        const provider = await providerService.createProvider(body);
        // if(subjectProvider.laboratorys){
        //     subjectProvider.laboratorys.push(laboratory);
        // }
        // else{
        //     subjectProvider.laboratorys.push(laboratory);
        // }
        const laboratoryUpdated = await laboratoryService.addProviderToLaboratoryById(laboratory.id, provider.id)
        res.status(200).json({"message" : "Provider created successfuly!!!"});

    }
    catch(error){
        res.status(500).json({"message" : "Error encounterd creating Provider!!!"});
    };

}

//Update Provider in Data Base
const updateProvider = async (req, res) =>{

    
    try {
        const body = JSON.parse(req.headers.body);

        if (req.file) {
          body.file = "/datas/" + req.file.filename;
        }
        const user = await api_consumer.getUserById(body._creator, req.token);
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
        body._creator = creator;
        const provider = await providerService.updateProviderById(req.params.providerId, body);
        res.status(200).json({"message" : "Provider updated successfuly!!!"});
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Error encounterd creating laboratory!!!"});
    }
}

//Delete Provider in Data Base
const deleteProvider = async (req, res) =>{
    // const body = JSON.parse(req.headers.body);
    //  if(req.file){
    //      body.image = "/datas/"+req.file.filename;
    //  }
     try{
         
         // body.creator = creator;
         const laboratory = await providerService.deleteProviderById(req.params.providerId);
         res.status(200).json({"message" : "Provider deleted successfuly!!!"});
     }
     catch(err){
         console.log(err)
         res.status(500).json({"message" : "Error encounterd creating course!!!"});
     }
 }

//Get a Provider in Data Base
const getProvider = async (req, res) =>{
    
    try{
        // const user = await api_consumer.getUserById(body.creator, req.token);
        // if(!user){
        //     res.status(401).json({"message" : "User not authenticated!!!"});
        // }
        const laboratory = await laboratoryService.getProviderById(req.params.laboratoryId);
        res.status(200).json(laboratory);
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Provider not exist in DB!!!"});
    }
}

//Get a Provider By Laboratory in Data Base
const getProviderLaboratory = async (req, res) =>{
    
    try{
        // const user = await api_consumer.getUserById(body.creator, req.token);
        // if(!user){
        //     res.status(401).json({"message" : "User not authenticated!!!"});
        // }
        const laboratory = await providerService.getProviderByLaboratoryId(req.params.laboratoryId);
        res.status(200).json(laboratory);
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Provider not exist in DB!!!"});
    }
}

//Get All Providers in Data Base
const getProviders = async (req, res) =>{
    
    try{
        // const user = await api_consumer.getUserById(body.creator, req.token);
        // if(!user){
        //     res.status(401).json({"message" : "User not authenticated!!!"});
        // }
        const providers = await providerService.getProviders();
        res.status(200).json(providers);
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Providers not exist in DB!!!"});
    }
}

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
    createProvider,
    updateProvider,
    getProvider,
    getProviders,
    getProviderLaboratory,
    deleteProvider
}
