const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: Number, required: true },
  fullName: { type: String, required: true },
  area: { type: String, required: true },
  gender: { type: String, required: true },
  orders: [{ type: mongoose.Types.ObjectId, required: true, ref: "Orders" }],
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", userSchema);
