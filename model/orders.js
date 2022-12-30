const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const ordersSchema = new Schema({
  userId: { type: String, required: true },
  orderDate: { type: Date, required: true },
  productsList: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Products",
      },
      amount: { type: Number, require: true },
    },
  ],
  price: { type: Number, required: true },
});
ordersSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Orders", ordersSchema);
