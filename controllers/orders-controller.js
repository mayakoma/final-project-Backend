const HttpError = require("../model/HttpError");
const User = require("../model/users");
const Orders = require("../model/ordersDetails");
const Products = require("../model/products");
const mongoose = require("mongoose");

const addOrder = async (req, res, next) => {
  const { userId, orderDate, productsList } = req.body;

  // products= products' list & amount
  // product= tmp product from Product Schema

  let products,
    product,
    price = 0;

  for (let i = 0; i < productsList.length; i++) {
    try {
      // find the Product
      product = await Products.findById(productsList[i].product);
    } catch (err) {}

    //create tmp object
    let tmp = { product: product, amount: productsList[i].amount };
    products.push(tmp);
    // sum  the total amount;
    price += product.price * productsList[i].amount;
  }

  const createdOrder = new Orders({
    userId,
    orderDate,
    productsList: products,
    price,
  });

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

  // add the order to Orders schema & to the relevant user.
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdOrder.save({ session: sess });
    user.orders.push(createdOrder);
    const ordersArr = user.orders;
    await user.update({ orders: ordersArr });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("creating order failed.", 500);
    return next(error);
  }

  res.status(201).json({ order: createdOrder.toObject({ getters: true }) });
};

exports.addOrder = addOrder;
