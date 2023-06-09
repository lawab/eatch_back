const Category = require("../models/category");

const { response } = require("express");

//Create category
const createCategory = async (categoryBody) => {
  const category = await Category.create(categoryBody);
  return category;
};

//Get all categories
const getCategories = async () => {
  const categories = await Category.find();
  return categories;
  // .then((err, data) =>{
  //     return data;
  // })
  // .catch((err) =>{
  //     return err;
  // });
};

//Get all categories
const getCategoriesByRestaurantId = async (restaurant) => {
  const categories = await Category.find({ "restaurant._id": restaurant });
  return categories;

  // .then((err, data) => {
  //   return data;
  // })
  // .catch((err) => {
  //   return err;
  // });
};

//Edit category by Id
const updateCategoryById = async (categoryId, categoryBody) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { $set: { ...categoryBody } },
    { new: true }
  );
  return category;
};

//Get category by Id
const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  return category;
};

//Get all categories
const getAllCategory = async () => {
  const categories = await Category.find();
  return categories;
};

/**
 *
 * @param {Object} query [query to find category in documents list. Default value is {}]
 * @returns {Promise}
 */
const deleteTrustlyCategory = async (query = {}) => {
  const category = await Category.deleteOne(query);
  return category;
};

module.exports = {
  createCategory,
  getCategories,
  updateCategoryById,
  getCategoryById,
  getAllCategory,
  getCategoriesByRestaurantId,
  deleteTrustlyCategory,
};
