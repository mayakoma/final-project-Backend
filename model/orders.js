const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const ordersSchema = new Schema({
  orderDetailesId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "OrdersDetailes",
  },
  product: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Products",
  },
  amount: { type: Number, require: true },
  totalPrice: { type: Number, required: true },
});
ordersSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Orders", ordersSchema);
