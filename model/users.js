const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
  area: { type: String, required: true },
  gender: { type: String, required: true },
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", userSchema);
