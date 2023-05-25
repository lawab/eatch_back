const print = require("../log/print");
const File = require("./File");
/**
 *
 * @param {Object} productServices [product service]
 * @param {Object} newproduct [new product created successfully ]
 * @returns {Promise<String>}
 */
const addProductFromJsonFile = async (productServices, _ = null) => {
  try {
    const FILENAME = "categories.json";
    // get all catégories in database
    let categories = (await productServices.getProductsByCategories()) || [];

    print({ categories, products: categories[0].products });

    // find index category in list of categories
    let newCategories = categories.map((category) => {
      return {
        title: category._id,
        products: category.products,
      };
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
