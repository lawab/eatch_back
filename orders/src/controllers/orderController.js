const { fieldsRequired } = require("../models/order/order");
const { fieldsValidator } = require("../models/order/validators");
const print = require("../log/print");
const orderServices = require("../services/orderServices");
const roles = require("../models/roles");
const updateForeignFields = require("./updateForeignFields");
const setForeignFieldsValue = require("./setForeignFieldsValue");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");

// create one order in database
const createOrder = async (req, res) => {
  try {
    let body = req.body;

    // verify fields on body
    let { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

    // if body have invalid fields
    if (!validate) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    body = await setForeignFieldsValue(orderServices, body, req.token);

    // add image from order
    body["image"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";
    body["_creator"] = body["client"]?._id; // set client as creator of current order

    let orderCreated = await orderServices.createOrder(body);
    print({ orderCreated }, "*");

    if (orderCreated?._id) {
      let response = await addElementToHistorical(
        async () => {
          let addResponse = await orderServices.addOrderToHistorical(
            body["client"]?._id,
            {
              orders: {
                _id: orderCreated?._id,
                action: "CREATED",
              },
            },
            req.token
          );

          return addResponse;
        },
        async () => {
          let elementDeleted = await orderServices.deleteTrustlyOrder({
            _id: orderCreated?._id,
          });
          print({ elementDeleted });
          return elementDeleted;
        }
      );

      return closeRequest(
        response,
        res,
        "Order has been created successfully!!!",
        "Order has  been not creadted successfully,please try again later,thanks!!!"
      );
    } else {
      res
        .status(401)
        .json({ message: "Order has been not created successfully!!!" });
    }
  } catch (error) {
    print(error, "x");
    return res
      .status(500)
      .json({ message: "Error occured during a creation of order!!!" });
  }
};

// update order in database
const updateOrder = async (req, res) => {
  try {
    // get body request
    let body = req.body;

    const { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

    if (!validate) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    // get the author who update order
    let creator = await orderServices.getUserAuthor(body?._creator, req.token);

    if (!creator?._id) {
      return res.status(401).json({
        message: "you must authenticated to update current order!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "you don't have authorization to update current order,please see your administrator",
      });
    }

    // get ordder that should be update
    let order = await orderServices.findOrder({
      _id: req.params?.id,
    });

    if (!order) {
      return res.status(401).json({
        message: "unable to update order because it not exists!!!",
      });
    }

    console.log({ order });

    let orderCopy = Object.assign({}, order._doc); // cppy documment before update it

    body["_creator"] = creator; // set user that make update in database

    body = await updateForeignFields(orderServices, body, req.token);

    // update all valid fields before save it in database
    for (let key in body) {
      order[key] = body[key];
    }

    // update avatar if exists
    order["image"] = req.file ? "/datas/" + req.file?.filename : order["image"];
    // update order in database
    let orderUpdated = await order.save({ validateModifiedOnly: true });

    print({ orderUpdated });

    if (orderUpdated?._id) {
      let response = await addElementToHistorical(
        async () => {
          let response = await orderServices.addOrderToHistorical(
            creator?._id,
            {
              orders: {
                _id: orderUpdated?._id,
                action: "UPDATED",
              },
            },
            req.token
          );

          return response;
        },
        async () => {
          for (const field in orderCopy) {
            if (Object.hasOwnProperty.call(orderCopy, field)) {
              orderUpdated[field] = orderCopy[field];
            }
          }
          let orderRestored = await orderUpdated.save({
            validateModifiedOnly: true,
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ orderRestored });
          return orderRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "Order has been updated successfully!!!",
        "Order has not been Updated successfully,please try again later,thanks!!!"
      );
    } else {
      return res.status(401).json({
        message: "Order update failed: order not exits in database!!",
      });
    }
  } catch (error) {
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
  try {
    let body = req.body;
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
    let orderCopy = Object.assign({}, order._doc);

    print({ orderCopy });

    //update deleteAt and cretor fields from order

    order.deletedAt = Date.now(); // set date of deletion
    order._creator = creator?._id; // the current order who do this action

    let orderDeleted = await order.save();
    console.log({ orderDeleted });
    // order exits and had deleted successfully
    if (orderDeleted?.deletedAt) {
      let response = await addElementToHistorical(
        async () => {
          let response = await orderServices.addOrderToHistorical(
            creator?._id,
            {
              orders: {
                _id: orderDeleted?._id,
                action: "DELETED",
              },
            },
            req.token
          );

          return response;
        },
        async () => {
          for (const field in orderCopy) {
            if (Object.hasOwnProperty.call(orderCopy, field)) {
              orderDeleted[field] = orderCopy[field];
            }
          }
          let orderRestored = await orderDeleted.save({
            timestamps: false,
          }); // restore Object in database,not update timestamps because it is restoration from olds values fields in database
          print({ orderRestored });
          return orderRestored;
        }
      );

      return closeRequest(
        response,
        res,
        "Order has been delete successfully!!!",
        "Order has not been delete successfully,please try again later,thanks!!!"
      );
    } else {
      return res.status(500).json({ message: "deletion order failed" });
    }
  } catch (error) {
    print(error, "x");
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
  deleteOrder,
  fetchOrders,
  updateOrder,
  fetchOrder,
  fetchOrdersByRestaurant,
  updateOrderRemote,
  deleteOrderRemote,
};
