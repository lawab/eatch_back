
const categoryService = require('../services/categoryServices');
const api_consumer = require('../services/api_consumer');
const category = require("../models/category");




//Create Category in Data Base
const createCategory = async (req, res) =>{
    const newCategory = {
        title: req.headers.title,
        user_id: req.headers.user_id,
        image: req.file? "/datas/"+req.file.filename: "",
        //restaurant_id: req.headers.restaurant_id,
        
    };
    
    console.log("USER: "+newCategory.user_id);
    try{
        const user = await api_consumer.getUserById(newCategory.user_id, req.token);
        
        
        console.log("THE USER:");
        //console.log(user)
        const creator = {
            _id : user.data._id,
            role: user.data.role,
            email: user.data.email,
            firstName: user.data.firstName,
            lastName: user.data.lastName
        };
        const restaurant = {
            _id : user.data.restaurant?._id,
            name_restaurant : user.data.restaurant?.name_restaurant,
            image_restaurant: user.data.restaurant?.image_restaurant
        }
        newCategory._creator = creator;
        newCategory.restaurant = restaurant;
        console.log(newCategory);
        const category = await categoryService.createCategory(newCategory);
        res.status(200).json({"message" : "Category created successfuly!!!"});

    }
    catch(error){
        res.status(500).json({"message" : "Error encounterd creating Category!!!"});
    };

}

//Update Category in Data Base
const updateCategory = async (req, res) =>{
    const newCategory = new category({
        title: req.headers.title,
        image: req.file? "/data/uploads/"+req.file.filename: req.headers.image
    });
    try{
        const category = await categoryService.updateCategoryById(req.params.categoryId, newCategory);
        res.status(200).json({"message" : "Category updatedted successfuly!!!"});
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Error encounterd creating category!!!"});
    }
}

//Get a Category in Data Base
const getCategory = async (req, res) =>{
    
    try{
        const category = await categoryService.getCategoryById(req.params.categoryId);
        res.status(200).json(category);
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Category not exist in DB!!!"});
    }
}

//Get All Categories in Data Base
const getCategories = async (req, res) =>{
    
    try{
        const categories = await categoryService.getCategories();
        res.status(200).json(categories);
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message" : "Categories not exist in DB!!!"});
    }
}

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
    createCategory,
    updateCategory,
    getCategory,
    getCategories
}
