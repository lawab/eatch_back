const File = require("./File");
const api_consumer = require("../services/api_consumer");
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
      (await api_consumer.getRemoteProductsByCategoriesForOneRestaurant(
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
        p["createdAt"] = product.createdAt;
        p["updatedAt"] = product.updatedAt;
        // p["category"] = {
        //   _id: product.category._id,
        //   title: product.category.title,
        //   image: product.category.image,
        // };
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

module.exports = {
  addProductFromJsonFile,
};