const File = require("./File");
const productServices = require("../products/src/services/productServices");
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

    let newCategories = categories
      .filter((cat) => !cat.deletedAt)
      .map((cat) => {
        let products = cat.products;
        let category = {};
        category["_id"] = cat["_id"];
        category["title"] = cat["title"];
        category["image"] = cat["image"];
        category["deletedAt"] = "null";
        category["createdAt"] = cat["createdAt"];
        category["updatedAt"] = cat["updatedAt"];

        let newproducts = products
          .filter((prod) => !prod.deletedAt)
          .map((product) => {
            let p = {};
            p["_id"] = product._id;
            p["price"] = product.price.toString();
            p["productName"] = product.productName.toString();
            p["promotion"] = product.promotion.toString();
            p["devise"] = product.devise.toString();
            p["image"] = product.image.toString();
            p["deletedAt"] = "null";
            p["createdAt"] = product.createdAt;
            p["updatedAt"] = product.updatedAt;
            p["quantity"] = Math.floor(Math.random() * 50).toString();
            return p;
          });

        console.log({ newproducts });

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
