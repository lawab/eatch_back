const print = require("../log/print");
const invoiceServices = require("../services/invoiceServices");
const roles = require("../models/roles");
const getInvoicePrice = require("./getInvoicePrice");
const orderStatus = require("../models/invoice/orderStatus");

// create one Invoice
const createInvoice = async (req, res) => {
  try {
    let idOrder = req.params?.id;
    let body = {};
    // if body have invalid fields
    if (!idOrder) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    // get creator since microservice users
    let creator = await invoiceServices.getUserAuthor(
      req.body?._creator,
      req.token
    );

    print({ creator: creator?._id }, "*");

    if (!creator?._id) {
      return res.status(401).json({
        message:
          "invalid data send,you must authenticated to create a invoice!!!",
      });
    }

    if (![roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      return res.status(401).json({
        message:
          "you have not authorization to create invoice,please see you administrator",
      });
    }

    body["_creator"] = creator; //set creator value found in database

    // get order in databsase
    let order = await invoiceServices.getOrder(idOrder, req.token);

    print({ order }, "*");
    if (!order?._id) {
      return res.status(401).json({
        message: "unable to create invoice because order not exists!!!",
      });
    }

    if (
      ![orderStatus.WAITED, orderStatus.TREATMENT, orderStatus.PAID].includes(
        order.status
      )
    ) {
      return res.status(401).json({
        message: "unable to create invoice because order had already paid!!!",
      });
    }

    //update status order since order microservice
    let orderUpdated = await invoiceServices.updateOrder(
      order?._id,
      { status: orderStatus.DONE, _creator: creator?._id },
      req.token
    ); //update status from order

    order["status"] = orderStatus.DONE; //set status order to done

    print(orderUpdated);

    body["order"] = order; //set order value found in database
    body["total"] = getInvoicePrice(order?.products); // set total frpice to current invoice

    let invoice = await invoiceServices.createInvoice(body);

    print({ invoice }, "*");

    if (invoice?._id) {
      res.status(200).json(invoice);
    } else {
      res
        .status(200)
        .json({ message: "Invoice has been not created successfully!!!" });
    }
  } catch (error) {
    print(error, "x");
    return res
      .status(500)
      .json({ message: "Error occured during a creation of Invoice!!!" });
  }
};

// fetch one invoice in database
const fetchInvoice = async (req, res) => {
  try {
    let invoice = await invoiceServices.findInvoice({
      _id: req.params?.id,
    });
    res.status(200).json(invoice);
  } catch (error) {
    print(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};
// get Invoices
const fetchInvoices = async (req, res) => {
  try {
    let invoices = await invoiceServices.findInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch Invoices by restaurant
const fetchInvoicesByRestaurant = async (req, res) => {
  try {
    let Invoices = await invoiceServices.findInvoices({
      "order.restaurant._id": req.params?.id,
    });
    res.status(200).json(Invoices);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

module.exports = {
  createInvoice,
  fetchInvoices,
  fetchInvoice,
  fetchInvoicesByRestaurant,
};
