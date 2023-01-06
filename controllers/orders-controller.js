const HttpError = require("../model/HttpError");
const User = require("../model/users");
const OrderDetails = require("../model/ordersDetails");
const Order = require("../model/orders");
const Products = require("../model/products");

//const mongoose = require("mongoose");

const addOrder = async (req, res, next) => {
  const { userId, productsList } = req.body;

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
  createdOrder.totalPrice = price;
  console.log(price);
  try {
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

exports.addOrder = addOrder;
