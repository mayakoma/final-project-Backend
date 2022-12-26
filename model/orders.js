const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const ordersSchema = new Schema({
  userId: { type: String, required: true },
  orders: [{ type: mongoose.Types.ObjectId, required: true, ref: "Products" }],
});
ordersSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Orders", ordersSchema);
