const categoryService = require("../services/categoryServices");
const api_consumer = require("../services/api_consumer");
const category = require("../models/category");
const { addElementToHistorical } = require("../services/historicalFunctions");
const {
  addProductFromJsonFile,
} = require("../../../globalservices/generateJsonFile");
const { shellService } = require("../../../globalservices/shelService");

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
  // let body = req.body;

  const newCategory = {
    title: body?.title,
    user_id: body?.user_id,
    image: req.file ? "/datas/" + req.file.filename : "/datas/avatar.png",
    restaurant_id: body?.restaurant_id,
  };
  let category = null;

  // console.log("USER: " + newCategory.user_id, { newCategory });
  try {
    const user = await api_consumer.getUserById(newCategory.user_id, req.token);

    let restaurant = await api_consumer.getRestaurantById(
      newCategory.restaurant_id,
      req.token
    );

    // console.log("THE RESTAURANT:");
    // console.log({ restaurant });

    //console.log(user)
    const creator = {
      _id: user?.data._id,
      role: user?.data.role,
      email: user?.data.email,
      firstName: user?.data.firstName,
      lastName: user?.data.lastName,
    };

    newCategory._creator = creator;
    newCategory["restaurant"] = restaurant;
    // console.log(newCategory);

    category = await categoryService.createCategory(newCategory);

    if (category) {
      // add new user create in historical
      let response = await addElementToHistorical(
        async () => {
          let response = await api_consumer.addToHistorical(
            category._creator._id,
            {
              categories: {
                _id: category._id,
                action: "CREATED",
              },
            },
            req.token
          );

          let { content } = await addProductFromJsonFile(
            restaurant._id,
            req.token
          );
          console.log({
            content: JSON.parse(content),
          });

          await shellService(restaurant._id, req.token);

          return response;
        },
        async () => {
          let elementDeleted = await categoryService.deleteTrustlyCategory({
            _id: category._id,
          });
          console.log({ elementDeleted });
        }
      );

      if (response?.status === 200) {
        console.log({ response: response.data?.message });
        return res
          .status(200)
          .json({ message: "Category has been created successfully!!!" });
      } else {
        return res.status(401).json({
          message: "Created Category failed,please try again!!!",
        });
      }
    } else {
      res
        .status(401)
        .json({ message: "Created Category failed,please try again!!!" });
    }
  } catch (error) {
    if (category) {
      let elementDeleted = await categoryService.deleteTrustlyCategory({
        _id: category._id,
      });
      console.log({ elementDeleted });
    }
    console.log(error);
    res.status(500).json({ message: "Error encounterd creating Category!!!" });
  }
};

//Update Category in Data Base
const updateCategory = async (req, res) => {
  const body = JSON.parse(req.headers.body);
  // const body = req.body;

  const user = await api_consumer.getUserById(body.user_id, req.token);

  const newCategory = {
    title: body.title,
    _creator: user._id,
    restaurant_id: body.restaurant_id,
  };

  let restaurant = await api_consumer.getRestaurantById(
    newCategory.restaurant_id,
    req.token
  );

  if (req.file) {
    newCategory["image"] = "/datas/" + req.file.filename;
  }

  let categoryCopied = null;
  let category = null;

  try {
    let oldCategory = await categoryService.getCategoryById(
      req.params.categoryId
    );

    if (!oldCategory) {
      throw new Error("unable to update unexisting category");
    }

    categoryCopied = Object.assign({}, oldCategory._doc);

    category = await categoryService.updateCategoryById(
      oldCategory._id,
      newCategory
    );

    console.log({ categoryUpdated: category });

    if (category) {
      // add new user create in historical
      let response = await addElementToHistorical(
        async () => {
          let response = await api_consumer.addToHistorical(
            category._creator._id,
            {
              categories: {
                _id: category._id,
                action: "UPDATED",
              },
            },
            req.token
          );

          let { content } = await addProductFromJsonFile(
            restaurant._id,
            req.token
          );
          console.log({
            content: JSON.parse(content),
          });

          await shellService(restaurant._id, req.token);

          return response;
        },
        async () => {
          for (const field in categoryCopied) {
            if (Object.hasOwnProperty.call(categoryCopied, field)) {
              category[field] = categoryCopied[field];
            }
          }

          let elementRestored = await category.save({
            timestamps: false,
          });
          console.log({ elementRestored });
        }
      );

      if (response?.status === 200) {
        console.log({ response: response.data?.message });
        return res
          .status(200)
          .json({ message: "Category has been updated successfully!!!" });
      } else {
        return res.status(401).json({
          message: "update Category failed,please try again!!!",
        });
      }
    } else {
      res
        .status(401)
        .json({ message: "Update Category failed,please try again!!!" });
    }
  } catch (err) {
    if (category && categoryCopied) {
      for (const field in categoryCopied) {
        if (Object.hasOwnProperty.call(categoryCopied, field)) {
          category[field] = categoryCopied[field];
        }
      }
      let elementRestored = await category.save({
        timestamps: false,
      });
      console.log({ elementRestored });
    }
    console.log(err);
    res.status(500).json({ message: "Error encounterd creating category!!!" });
  }
};

const deleteCategory = async (req, res) => {
  let categoryCopied = null;
  let category = null;

  try {
    console.log({ body: req.headers.body });
    const body = JSON.parse(req.headers.body);
    // const body = req.body;

    let oldCategory = await categoryService.getCategoryById(
      req.params.categoryId
    );

    if (!oldCategory) {
      throw new Error("unable to update unexisting category");
    }

    // fetch restaurant since microservice restaurant
    let restaurant = await api_consumer.getRestaurantById(
      body?.restaurant_id,
      req.token
    );

    if (!restaurant?._id) {
      throw new Error("restaurant not found!!");
    }

    categoryCopied = Object.assign({}, oldCategory._doc);

    oldCategory.deletedAt = Date.now();

    const category = await oldCategory.save();
    console.log({ categoryDeleted: category });
    if (category) {
      // add new user create in historical
      let response = await addElementToHistorical(
        async () => {
          let response = await api_consumer.addToHistorical(
            category._creator._id,
            {
              categories: {
                _id: category._id,
                action: "DELETED",
              },
            },
            req.token
          );

          let { content } = await addProductFromJsonFile(
            restaurant._id,
            req.token
          );
          console.log({
            content: JSON.parse(content),
          });
          await shellService(restaurant._id, req.token);
          return response;
        },
        async () => {
          // restore only fields would had changed in database
          category["deletedAt"] = categoryCopied["deletedAt"];
          category["updatedAt"] = categoryCopied["updatedAt"];
          category["createdAt"] = categoryCopied["createdAt"];

          let elementRestored = await category.save({
            timestamps: false,
          });
          console.log({ elementRestored });
        }
      );

      if (response?.status === 200) {
        console.log({ response: response.data?.message });
        return res
          .status(200)
          .json({ message: "Category has been deleted successfully!!!" });
      } else {
        return res.status(401).json({
          message: "delection of category failed,please try again!!!",
        });
      }
    } else {
      res
        .status(401)
        .json({ message: "delection of category failed,please try again!!!" });
    }

    console.log({ category });

    res.status(200).json(category);
  } catch (err) {
    if (category && categoryCopied) {
      // restore only fields would had changed in database
      category["deletedAt"] = categoryCopied["deletedAt"];
      category["updatedAt"] = categoryCopied["updatedAt"];
      category["createdAt"] = categoryCopied["createdAt"];

      let elementRestored = await category.save({
        timestamps: false,
      });
      console.log({ elementRestored });
    }
    console.log(err);
    res.status(500).json({ message: "Categories not exists in DB!!!" });
  }
};

//Get a Category in Data Base
const getCategory = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(
      req.params.categoryId
    );
    console.log({ category });
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Category not exist in DB!!!" });
  }
};

//Get All Categories in Data Base
const getCategories = async (req, res) => {
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

//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  createCategory,
  updateCategory,
  getCategory,
  getCategories,
  getCategoriesByRestaurant,
  deleteCategory,
};
