const HttpError = require("../model/HttpError");
const User = require("../model/users");
const OrderDetails = require("../model/ordersDetails");
const Order = require("../model/orders");
const Products = require("../model/products");

//const mongoose = require("mongoose");

const addOrder = async (req, res, next) => {
  const { userId, productsList, address } = req.body;

  // find the user at User schema
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Creating order failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("user not found.", 404);
    return next(error);
  }

  //create orderDetails
  const createdOrder = new OrderDetails({
    userId: user,
    orderDate: new Date(),
    totalPrice: 0,
    address,
  });

  //add order to mongo
  let orderID;
  try {
    orderID = await createdOrder.save();
  } catch (err) {
    const error = new HttpError("creating order failed.", 500);
    return next(error);
  }
  console.log("order details done");

  // add the product &  amount to orders tbl
  let product,
    productObject,
    price = 0,
    pid;

  for (let i = 0; i < productsList.length; i++) {
    try {
      pid = productsList[i].product;
      console.log(pid);
      product = await Products.findById(pid).populate("price");
    } catch (err) {
      const error = new HttpError(
        "Creating order failed, please try again. find product",
        500
      );
      return next(error);
    }

    productObject = new Order({
      orderDetailesId: orderID,
      product,
      amount: productsList[i].amount,
    });
    // calc price
    price += product.price * productsList[i].amount;

    //save order
    try {
      await productObject.save();
    } catch (err) {
      const error = new HttpError(
        "Creating order failed, please try again.- create order",
        500
      );
      return next(error);
    }
  }

  try {
    createdOrder.totalPrice = price;
    await createdOrder.save();
  } catch (err) {
    const error = new HttpError(
      "Creating order failed, please try again. update order price",
      500
    );
    return next(error);
  }

  res.status(201).json({ order: createdOrder.toObject({ getters: true }) });
};

const updateOrder = async (req, res, next) => {
  const { orderId, address } = req.body;
  console.log(address);
  console.log(orderId);
  let order;
  try {
    order = await OrderDetails.findById(orderId);
    if (order) console.log(order);
    else {
      console.log("not found");
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot update order",
      500
    );
    return next(error);
  }

  if (!order) {
    const error = new HttpError(
      "Something went wrong, cannot update order not fount id",
      500
    );
    return next(error);
  }
  order.address = address;
  try {
    await order.save();
  } catch (err) {
    console.log("catch");
    const error = new HttpError(
      "Something went wrong, cannot update order",
      500
    );
    return next(error);
  }
  res.status(201).json({ order: order.toObject({ getters: true }) });
};

const deleteOrder = async (req, res, next) => {
  const { orderId } = req.body;
  let order, orderDetail;

  try {
    order = await Order.find({ orderDetailesId: orderId });
    orderDetail = await OrderDetails.findById(orderId);
  } catch (err) {}

  if (order.length == 0) return;

  for (let i = 0; i < order.length; i++) {
    try {
      await order[i].remove();
    } catch (err) {}
  }

  try {
    await orderDetail.remove();
  } catch (err) {}

  res.status(200).json({ message: "Deleted order" });
};
const getOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await OrderDetails.find({});
  } catch (err) {}

  let fullOrder = [],
    ordersProducts;
  for (let i = 0; i < orders.length; i++) {
    try {
      ordersProducts = await Order.find(
        {
          orderDetailesId: orders[i]._id.toString(),
        },
        "-orderDetailesId"
      );
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, cannot get orders",
        500
      );
      return next(error);
    }
    fullOrder.push({ orderDetailes: orders[i], Products: ordersProducts });
  }

  res.status(201).json(fullOrder);
};

const getOrdersByProducts = async (req, res, next) => {};
exports.addOrder = addOrder;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
exports.getOrders = getOrders;
exports.getOrdersByProducts = getOrdersByProducts;
