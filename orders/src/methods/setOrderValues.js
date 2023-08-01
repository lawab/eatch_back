const { default: mongoose } = require("mongoose");
const orderServices = require("../services/orderServices");
/**
 *
 * @param {Object} body [Body Object from express]
 * @param {Object} req [req Object from express]
 * @returns {Promise<Array<Object>}
 */
module.exports = async (body, req) => {
  try {
    let products = [];
    let menus = [];

    // get all products and menus existing in array data
    for (const category of body) {
      if (category.title !== "menu") {
        let newProducts = category.products.map((product) => {
          return {
            category: {
              _id: category._id,
              title: category.title,
            },
            ...product,
          };
        });

        products.push(...newProducts);
      }
      if (category.title == "menu") {
        menus.push(...category.menus);
      }
    }

    let newBody = {
      products,
      menus,
    };

    return newBody;
    // add new

    // let errorMessage = (field) => `invalid ${field}`;
    // let token = req.token;

    // // find restaurant in database
    // let restaurant = await orderServices.getRestaurant(body?.restaurant, token);

    // if (!restaurant?._id) {
    //   throw new Error(errorMessage("restaurant"));
    // }

    // console.log({ restaurant });

    // // update restaurant with value found in database
    // body["restaurant"] = restaurant;

    // // find client in database
    // let client = await orderServices.getClient(body?.client, token);
    // console.log({ client });

    // // if client not exists in database, generate random _id for client
    // if (!client?._id) {
    //   body["client"] = {
    //     _id: mongoose.Types.ObjectId(),
    //   };
    // }

    // //if client found in database, set client found in database
    // if (client?._id) {
    //   body["client"] = client;
    // }

    // if (body?.products) {
    //   // set ids list from products
    //   let productsIds = body?.products;

    //   if (!productsIds?.length) {
    //     throw new Error(errorMessage("products"));
    //   }

    //   // get list of products
    //   let products = await orderServices.getProducts(productsIds, token);

    //   console.log({ products });
    //   let invalidProducts = products.filter((el) => !el);

    //   // verify that products has been set successfully
    //   if (
    //     !products?.length ||
    //     products?.length !== body?.products?.length ||
    //     invalidProducts?.length
    //   ) {
    //     throw new Error(errorMessage("products"));
    //   }
    //   console.log({ products });

    //   body["products"] = products;
    // }

    // if (body?.menus) {
    //   let menus = await orderServices.getMenus(body?.menus, token);
    //   if (!menus.filter((menu) => !menu) || !menus.length) {
    //     throw new Error(errorMessage("menus"));
    //   }
    //   console.log({ menus });
    //   body["menus"] = menus;
    // }

    // // body["products"] = products.map((product) => {
    // //   let productFound = body.products.find((p) => p._id === product._id);
    // //   return { ...product, quantity: productFound.quantity };
    // // });

    // add image from order
    body["image"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";

    return body;
  } catch (error) {
    console.log({ error }, "x");
    throw new Error(error.message);
  }
};
