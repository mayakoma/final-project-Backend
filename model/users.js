const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  area: { type: String, required: true },
  gender: { type: String, required: true },
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", userSchema);
