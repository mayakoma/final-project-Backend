const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const productsSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: string, required: true }],
});
productsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Products", productsSchema);
