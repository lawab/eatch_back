const { fieldsRequired } = require("../models/order/order");
const { fieldsValidator } = require("../models/order/validators");
const print = require("../log/print");
const orderServices = require("../services/orderServices");
const roles = require("../models/roles");
const updateForeignFields = require("./updateForeignFields");
const setForeignFieldsValue = require("./setForeignFieldsValue");

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

    let orderCreated = await orderServices.createOrder(body);
    print({ orderCreated }, "*");

    if (orderCreated?._id) {
      return res
        .status(200)
        .json({ message: "order has been created successfully!!!" });
    } else {
      return res
        .status(200)
        .json({ message: "order has been not created successfully!!!" });
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
      return res
        .status(200)
        .json({ message: "Order has been updated successfully!!" });
    } else {
      return res.status(401).json({
        message: "Order update failed: order not exits in database!!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erros occured during the update order!!!",
    });
  }
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

    // find and delete order
    let orderDeleted = await orderServices.deleteOne(
      {
        _id: req.params?.id,
        deletedAt: null,
      },
      { _creator: creator._id, deletedAt: Date.now() } //set user creator and the date of deletion,no drop order
    );

    // if order not exits or had already deleted
    if (!orderDeleted?._id) {
      return res.status(401).json({
        message:
          "you cannot delete order because it not exists or already deleted!!!",
      });
    }
    // order exits and had deleted successfully
    if (orderDeleted?.deletedAt) {
      print({ orderDeleted: orderDeleted });
      return res
        .status(200)
        .json({ message: "order has been delete sucessfully!!!" });
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
};
