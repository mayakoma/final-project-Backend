const HttpError = require("../model/HttpError");
const Admin = require("../model/admins");

const addAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  let createdAdmin = new Admin({
    email,
    password,
  });
  try {
    await createdAdmin.save();
  } catch (err) {}

  res.status(201).json({ Admin: createdAdmin.toObject({ getters: true }) });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let admin;
  try {
    admin = await Admin.find({ email: email });
  } catch (err) {
    const error = new HttpError("login failed.", 500);
    return next(error);
  }
  if (!admin || admin.password != password) {
    const error = new HttpError("login failed.", 500);
    return next(error);
  }
  res.status(201).json({ admin: admin.toObject({ getters: true }) });
};

exports.addAdmin = addAdmin;
exports.login = login;
