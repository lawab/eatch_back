const print = require("../log/print");
const invoiceServices = require("../services/invoiceServices");
const roles = require("../models/roles");
const getInvoicePrice = require("./getInvoicePrice");
const orderStatus = require("../models/invoice/orderStatus");
const {
  addElementToHistorical,
  closeRequest,
} = require("../services/historicalFunctions");
const setInvoiceValues = require("../methods/setInvoiceValues");

// create one Invoice
const createInvoice = async (req, res) => {
  // global variable to do fallback if error occured during execution
  let orderUpdated = {};
  let orderCopy = {};

  try {
    let body = req.body;
    let idOrder = req.params?.id;

    let bodyUpdate = await setInvoiceValues(body, req.token, req);

    // get order in databsase
    let order = await invoiceServices.getOrder(idOrder, req.token);

    print({ order }, "*");
    if (!order || order.deletedAt) {
      return res.status(401).json({
        message:
          "unable to create invoice because order not exists or has been deleted!!!",
      });
    }

    // if order has already paid or body content invalid status or body status is not send with done value
    if (
      order.status === orderStatus.DONE ||
      !Object.keys(orderStatus).includes(body?.status) ||
      body?.status !== orderStatus.DONE
    ) {
      return res.status(401).json({
        message:
          "unable to create invoice because order had already paid or has invalid status!!!",
      });
    }

    orderCopy = Object.assign({}, order);

    print({ orderCopy });

    //update status order since order microservice

    orderUpdated = await invoiceServices.updateOrderRemote(
      order._id,
      {
        status: orderStatus.DONE,
        _creator: bodyUpdate.creator._id,
      },
      req.token
    );

    if (!orderUpdated) {
      return res.status(401).json({
        message: "create invoice failed !!!",
      });
    }

    let products = orderUpdated.products?.map((pd) => ({
      _id: pd._id,
      // quantity: pd.quantity,
    })); // get list of products to set decrement quantity value

    print({ products, token: req.token });

    // decrement each quantity from products
    let productsUpdated =
      await invoiceServices.decrementQuantityFromRemoteProducts(
        products,
        req.token
      );

    print({ orderUpdated, productsUpdated });

    // if decrementation failed
    if (!productsUpdated) {
      // reset order because products have not updated successfully
      let orderRestored = await invoiceServices.updateOrderRemote(
        orderUpdated?._id,
        orderCopy,
        req.token
      );
      let productsRestored =
        await invoiceServices.incrementQuantityFromRemoteProducts(
          products,
          req.token
        );
      // restore Object in database,not update timestamps because it is restoration from olds values fields in database
      print({ orderRestored, productsRestored });
      throw new Error("unable to update remote products");
    }

    body["order"] = orderUpdated; //set order value found in database
    body["total"] = getInvoicePrice(orderUpdated?.products); // set total price to current invoice
    body["image"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png"; //set image for current invoice

    let invoice = await invoiceServices.createInvoice(body);

    print({ invoice }, "*");

    if (invoice?._id) {
      let response = await addElementToHistorical(
        async () => {
          let addResponse = await invoiceServices.addInvoiceToHistorical(
            creator._id,
            {
              invoices: {
                _id: invoice?._id,
                action: "CREATED",
              },
            },
            req.token
          );

          return addResponse;
        },
        async () => {
          let elementDeleted = await invoiceServices.deleteTrustlyInvoice({
            _id: invoice?._id,
          });

          print({ elementDeleted });

          // reset order because creation of invoice failed or orther error occured
          return await resetOrder(orderUpdated, orderCopy, req);
        }
      );

      return closeRequest(
        response,
        res,
        invoice,
        "Invoice has  been not creadted successfully,please try again later,thanks!!!"
      );
    } else {
      res
        .status(200)
        .json({ message: "Invoice has been not created successfully!!!" });
    }
  } catch (error) {
    if (orderUpdated?._id) {
      await resetOrder(orderUpdated, orderCopy, req);
    }
    print(error.message, "x");
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
async function resetOrder(orderUpdated, orderCopy, req) {
  let orderRestored = await invoiceServices.updateOrderRemote(
    orderUpdated?._id,
    orderCopy,
    req.token
  );
  // restore Object in database,not update timestamps because it is restoration from olds values fields in database
  print({ orderRestored });
  return orderRestored;
}
module.exports = {
  createInvoice,
  fetchInvoices,
  fetchInvoice,
  fetchInvoicesByRestaurant,
};
