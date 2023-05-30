const print = require("../log/print");
const File = require("./File");
const productServices = require("../services/productServices");
/**
 *
 * @param {String} restaurantId [id of restaurant ]
 * @param {token} token [token to authenticated user ]
 * @returns {Promise<String>}
 */
const addProductFromJsonFile = async (restaurantId, token) => {
  try {
    const FILENAME = "categories.json";
    // get all catégories in database
    let categories =
      (await productServices.getProductsByCategoriesForOneRestaurant(
        restaurantId,
        token
      )) || [];

    let newCategories = categories.map((cat) => {
      let products = cat.products;
      let category = {};
      category["_id"] = cat["_id"];
      category["title"] = cat["title"];
      category["image"] = cat["image"];
      category["deletedAt"] = cat.deletedAt ? cat.deletedAt : "null";
      category["createdAt"] = cat["createdAt"];
      category["updatedAt"] = cat["updatedAt"];

      let newproducts = products.map((product) => {
        let p = {};
        p["_id"] = product._id;
        p["price"] = product.price.toString();
        p["productName"] = product.productName.toString();
        p["promotion"] = product.promotion.toString();
        p["devise"] = product.devise.toString();
        p["image"] = product.image.toString();
        p["deletedAt"] = product.deletedAt ? product.deletedAt : "null";
        p["deletedAt"] = product.createdAt.toString();
        p["updatedAt"] = product.createdAt.toString();
        p["category"] = {
          _id: product.category._id,
          title: product.category.title,
          image: product.category.image,
        };
        return p;
      });

      category["products"] = [...newproducts];

      return category;
    });

    let file = new File();

    let content = await file.writeToFile(
      FILENAME,
      JSON.stringify(newCategories)
    );

    return content;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 *
 * @param {Object} productServices [product service]
 * @param {Object} newproduct [new product created successfully ]
 * @returns {Promise<String>}
 */
const deleteProductFromJsonFile = async (productServices, newproduct) => {
  try {
    const FILENAME = "categories.json";
    // get all catégories in database
    let categories = (await productServices.getCategories()) || [];

    // find index category in list of categories
    let categoryIndex = categories.findIndex(
      (category) => category?.title === newproduct.category?.title
    );

    let file = new File(); // create instance of new File

    // if category exists
    if (categoryIndex !== -1) {
      const productsCategory = categories[categoryIndex]["products"];

      print({ productsCategoryAfter: productsCategory });

      //delete product of category
      const newProductsCategory = productsCategory.filter((pd) => {
        print({
          _id1: pd._id,
          _id2: newproduct?._id,
        });
        return pd?._id !== newproduct?._id;
      });

      print({
        newProductsCategory: newProductsCategory,
        categoryIndex,
      });

      categories[categoryIndex]["products"] = newProductsCategory;

      // update categories.json file
      let content = await file.writeToFile(
        FILENAME,
        JSON.stringify(categories)
      );

      print({ contentFileUpdated: JSON.parse(content)[categoryIndex] });

      return content;
    } else {
      //update categories,add new category
      categories = [
        ...categories,
        {
          _id: newproduct.category._id,
          title: newproduct.category.title,
          products: [newproduct],
        },
      ];

      print({ categories });

      // update categories.json file
      let content = await file.writeToFile(
        FILENAME,
        JSON.stringify(categories)
      );

      print({ contentFileUpdated: JSON.parse(content) });
      return content;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  addProductFromJsonFile,
  deleteProductFromJsonFile,
};
