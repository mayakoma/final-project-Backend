const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const ordersDetailesSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "Users" },
  orderDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
});
ordersDetailesSchema.plugin(uniqueValidator);

module.exports = mongoose.model("OrdersDetailes", ordersDetailesSchema);

// productsList: [
//   {
//     product: {
//       type: mongoose.Types.ObjectId,
//       required: true,
//       ref: "Products",
//     },
//     amount: { type: Number, require: true },
//   },
// ],
