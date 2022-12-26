const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: string, required: true },
});
adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Admin", adminSchema);
