const orderServices = require("../services/orderServices");
const roles = require("../models/roles");
const updateOrderValues = require("../methods/updateValues");
const setOrderValues = require("../methods/setOrderValues");
const api_consumer = require('../services/api_consumer')
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");


//Create 2nd version Order
const createOrderversion2 = async (req, res) => {
  
  try {
    const body = req.body[0]
    const menus = []
    //console.log(body)
    const menu = body.menus
    const products = body.products
    const total_cost = body.adition
    for (let i = 0; i < menu.length; i++){
      const menuFound = await api_consumer.getMenuById(menu[i]._id);
      // if (!menuFound) {
      //   return res.status(401).json({ message: "Menu not found!!!" });
      // }
      menus.push(menuFound.data)
    }
    console.log("*******************************************");
    console.log(menus)
    console.log("###########################################");
    //console.log(products)
    console.log("********************************************")
    //console.log(menu)

    const order = {
      total_cost: total_cost.totale,
      products: products,
      menus: menus
    }
    const orderCreated = await orderServices.createOrder(order)
    console.log(orderCreated);
    res.status(200).json({"message" : "Order created successfully!!!"})
  } catch (error) {
    res.status(500).json({"message" : "An Error occured!!!"})
  }
}

// create one order in database
const createOrder = async (req, res) => {
  try {
    console.log("*******************req******************");
    console.log(req)
    //let bodyContent = JSON.parse(req.headers.body);
    let bodyContent = req.body;
    console.log(bodyContent);
    // set all values required
    body = await setOrderValues(bodyContent, req);

    let orderCreated = await orderServices.createOrder(body);

    console.log({ orderCreated }, "*");

    // if (orderCreated?._id) {
    //   let response = await addElementToHistorical(
    //     async () => {
    //       return await orderServices.addOrderToHistorical(
    //         orderCreated._id,
    //         {
    //           orders: {
    //             _id: orderCreated._id,
    //             action: "CREATED",
    //           },
    //         },
    //         req.token
    //       );
    //     },
    //     async () => {
    //        let elementDeleted = await orderServices.deleteTrustlyOrder({
    //          _id: orderCreated._id,
    //        });
    //       console.log({ elementDeleted });
    //       return elementDeleted;
    //     }
    //   );

    //   return closeRequest(
    //     response,
    //     res,
    //     "Order has been created successfully!!!",
    //     "Order has  been not creadted successfully,please try again later,thanks!!!"
    //   );
    // } else {
    //   res
    //     .status(401)
    //     .json({ message: "Order has been not created successfully!!!" });
    // }
    res.status(200).json({"message" : "Order created successfully!!!"})
  } catch (error) {
    console.log(error, "x");
    return res
      .status(500)
      .json({ message: "Error occured during a creation of order!!!" });
  }
};

// update order in database
const updateOrder = async (req, res) => {
  let orderUpdated = null;
  let orderCopy = null;

  try {
    // get body request
    let body = JSON.parse(req.headers.body);

    // get order that should be update
    let order = await orderServices.findOrder({
      _id: req.params?.id,
    });

    if (!order) {
      return res.status(401).json({
        message: "unable to update order because it not exists!!!",
      });
    }

    console.log({ order });

    // copy documment before update it
    orderCopy = Object.assign({}, order._doc);

    // update products only because it is a user that update his order
    body = await updateOrderValues(body, req);

    // update order in database
    orderUpdated = await orderServices.updateOrder(
      {
        _id: order._id,
      },
      {
        ...body,
      }
    );

    console.log({ orderUpdated });

    // if (orderUpdated?._id) {
    //   let response = await addElementToHistorical(
    //     async () => {
    //       return await orderServices.addOrderToHistorical(
    //         orderUpdated._id,
    //         {
    //           orders: {
    //             _id: orderUpdated._id,
    //             action: "UPDATED",
    //           },
    //         },
    //         req.token
    //       );
    //     },
    //     async () => {
    //       for (const field in orderCopy) {
    //         if (Object.hasOwnProperty.call(orderCopy, field)) {
    //           orderUpdated[field] = orderCopy[field];
    //         }
    //       }
    //       /*
    //         restore Object in database,not update timestamps
    //         because it is restoration from olds values fields in database
    //       */
    //       let orderRestored = await orderUpdated.save({
    //         timestamps: false,
    //       });
    //       console.log({ orderRestored });
    //       return orderRestored;
    //     }
    //   );

    //   return closeRequest(
    //     response,
    //     res,
    //     "Order has been updated successfully!!!",
    //     "Order has not been Updated successfully,please try again later,thanks!!!"
    //   );
    // } else {
    //   return res.status(401).json({
    //     message: "Order update failed: order not exits in database!!",
    //   });
    // }
    res.status(200).json({"message" : "Order updated successfully"})
  } catch (error) {
    // if (orderUpdated && orderCopy) {
    //   for (const field in orderCopy) {
    //     if (Object.hasOwnProperty.call(orderCopy, field)) {
    //       orderUpdated[field] = orderCopy[field];
    //     }
    //   }

    //   //restore Object in database,not update timestamps
    //   //because it is restoration from olds values fields in database
    //   let orderRestored = await orderUpdated.save({
    //     timestamps: false,
    //   });
    //   console.log({ orderRestored });
    // }

    console.log(error);
    res.status(500).json({
      message: "Error(s) occured during the update order!!!",
    });
  }
};



//update remote order
const updateOrderRemote = async (req, res) => {
  try {
    console.log(req.body);
    let body = req.body?.data;
    let orderUpdated = await orderServices.updateOrder(
      {
        _id: req.params?.id,
      },
      body
    );

    console.log({ orderUpdated });
    return res.status(200).json(orderUpdated);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error occured please try again!!!" });
  }
};

const deleteOrderRemote = async (req, res) => {
  let response = await orderServices.deleteTrustlyOrder({
    _id: req.params?.id,
  });

  return res.status(200).json(response);
};
// delete one order in database
const deleteOrder = async (req, res) => {
  let orderCopy = null;
  let orderDeleted = null;
  try {
    // get body request
    let body = JSON.parse(req.headers.body);

    // check if creator has authorization
    let creator = await orderServices.getUserAuthor(body?._creator, req.token);

    if (!creator?._id) {
      return res.status(401).json({
        message: "you must authenticated to delete current order!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "you don't have authorization to delete current order,please see your administrator",
      });
    }

    // get ordder that should be delete
    let order = await orderServices.findOrder({
      _id: req.params?.id,
      deletedAt: null,
    });

    if (!order) {
      return res.status(401).json({
        message:
          "you cannot delete order because it not exists or already deleted!!!",
      });
    }

    /* copy values and fields from order found in database before updated it. 
       it will use to restore order updated if connection with historical failed
      */
    orderCopy = Object.assign({}, order._doc);

    console.log({ orderCopy });

    //update deleteAt and cretor fields from order

    order.deletedAt = Date.now(); // set date of deletion
    order._creator = creator?._id; // the current order who do this action

    orderDeleted = await order.save();
    console.log({ orderDeleted });
    // order exits and had deleted successfully
    // if (orderDeleted?.deletedAt) {
    //   let response = await addElementToHistorical(
    //     async () => {
    //       let response = await orderServices.addOrderToHistorical(
    //         creator?._id,
    //         {
    //           orders: {
    //             _id: orderDeleted?._id,
    //             action: "DELETED",
    //           },
    //         },
    //         req.token
    //       );

    //       return response;
    //     },
    //     async () => {
    //       // restore only fields would had changed in database
    //       orderDeleted["deletedAt"] = orderCopy["deletedAt"];
    //       orderDeleted["updatedAt"] = orderCopy["updatedAt"];
    //       orderDeleted["createdAt"] = orderCopy["createdAt"];
    //       let orderRestored = await orderDeleted.save({
    //         timestamps: false,
    //       }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
    //       console.log({ orderRestored });
    //       return orderRestored;
    //     }
    //   );

    //   return closeRequest(
    //     response,
    //     res,
    //     "Order has been delete successfully!!!",
    //     "Order has not been delete successfully,please try again later,thanks!!!"
    //   );
    // } else {
    //   return res.status(500).json({ message: "deletion order failed" });
    // }
  } catch (error) {
    // if (orderDeleted && orderCopy) {
    //   // restore only fields would had changed in database
    //   orderDeleted["deletedAt"] = orderCopy["deletedAt"];
    //   orderDeleted["updatedAt"] = orderCopy["updatedAt"];
    //   orderDeleted["createdAt"] = orderCopy["createdAt"];
    //   let orderRestored = await orderDeleted.save({
    //     timestamps: false,
    //   }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
    //   console.log({ orderRestored });
    // }

    console.log(error, "x");
    return res
      .status(500)
      .json({ message: "Error(s) occured during the deletion of order!!!" });
  }
};
// get one order in database
const fetchOrder = async (req, res) => {
  try {
    let order = await orderServices.findOrder({
      _id: req.params?.id,
    });
    res.status(200).json(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};
// get orders in database
const fetchOrders = async (_, res) => {
  try {
    let orders = await orderServices.findOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch orders by restaurant in database
const fetchOrdersByRestaurant = async (req, res) => {
  try {
    let orders = await orderServices.findOrders({
      "restaurant._id": req.params?.id,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

module.exports = {
  createOrder,
  createOrderversion2,
  deleteOrder,
  fetchOrders,
  updateOrder,
  fetchOrder,
  fetchOrdersByRestaurant,
  updateOrderRemote,
  deleteOrderRemote,
};
