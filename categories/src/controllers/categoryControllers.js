const categoryService = require("../services/categoryServices");
const api_consumer = require("../services/api_consumer");
const category = require("../models/category");

//Create Category in Data Base
const createCategory = async (req, res) => {
  console.log("*********************************************");
  console.log(req.headers);
  console.log("*********************************************");

  console.log("*********************************************");
  console.log(req.body);
  console.log("*********************************************");

  console.log("*********************************************");
  console.log(req.file);
  console.log("*********************************************");

  let body = JSON.parse(req.headers?.body);
  const newCategory = {
    title: body?.title,
    user_id: body?.user_id,
    image: req.file ? "/datas/" + req.file.filename : "/datas/avatar.jpeg",
    restaurant_id: body?.restaurant_id,
  };

  console.log("USER: " + newCategory.user_id, { newCategory });
  try {
    const user = await api_consumer.getUserById(newCategory.user_id, req.token);

    let restaurant = await api_consumer.getRestaurantById(
      newCategory.restaurant_id,
      req.token
    );

    console.log("THE RESTAURANT:");
    console.log({ restaurant });
    console.log("THE USER:");

    //console.log(user)
    const creator = {
      _id: user?.data._id,
      role: user?.data.role,
      email: user?.data.email,
      firstName: user?.data.firstName,
      lastName: user?.data.lastName,
    };
    // const restaurant = {
    //   _id: user?.data.restaurant?._id,
    //   name_restaurant: user?.data.restaurant?.name_restaurant,
    //   image_restaurant: user?.data.restaurant?.image_restaurant,
    // };
    newCategory._creator = creator;
    newCategory["restaurant"] = restaurant;
    console.log(newCategory);
    const category = await categoryService.createCategory(newCategory);
    res.status(200).json({ message: "Category created successfuly!!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error encounterd creating Category!!!" });
  }
};

//Update Category in Data Base
const updateCategory = async (req, res) => {
  const body = JSON.parse(req.headers.body);

  const user = await api_consumer.getUserById(body.user_id, req.token);

  const newCategory = {
    title: body.title,
    _creator: user._id,
  };

  if (req.file) {
    newCategory["image"] = "/data/uploads/" + req.file.filename;
  }
  // const newCategory = new category({
  //   title: body.title,
  //   image: req.file ? "/data/uploads/" + req.file.filename : body.image,
  // });
  try {
    const category = await categoryService.updateCategoryById(
      req.params.categoryId,
      newCategory
    );
    console.log({ category });
    res.status(200).json({ message: "Category updatedted successfuly!!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd creating category!!!" });
  }
};

//Get a Category in Data Base
const getCategory = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(
      req.params.categoryId
    );
    console.log({ categoryFound: category });
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Category not exist in DB!!!" });
  }
};

//Get All Categories in Data Base
const getCategories = async (req, res) => {
  const restaurant = req.body;
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Categories not exist in DB!!!" });
  }
};

//Get All Categories By Restaurant in Data Base
const getCategoriesByRestaurant = async (req, res) => {
  const restaurant = req.params?.restaurantId;
  try {
    const categories = await categoryService.getCategoriesByRestaurantId(
      restaurant
    );
    res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Categories not exist in DB!!!" });
  }
};

const deleteCategory = async (req, res) => {
  const body = JSON.parse(req.headers?.body);

  const categoryId = req.body;

  try {
    const category = await categoryService.getCategoryById({});
    res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Categories not exist in DB!!!" });
  }
};

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  createCategory,
  updateCategory,
  getCategory,
  getCategories,
  getCategoriesByRestaurant,
};
