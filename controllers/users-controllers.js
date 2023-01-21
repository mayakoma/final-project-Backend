const HttpError = require("../model/HttpError");
const User = require("../model/users");
const Orders = require("../model/ordersDetails");

const signup = async (req, res, next) => {
  const { email, password, userName, area, gender } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed ", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    email,
    password,
    userName,
    area,
    gender,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Log in failed, please try again", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid data, could not log in", 401);
    return next(error);
  }

  res
    .status(200)
    .json({ message: "login", user: existingUser.toObject({ getters: true }) });
};

const updateUser = async (req, res, next) => {
  const { userId, userName, area, gender } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot update user",
      500
    );
    return next(error);
  }

  user.userName = userName;
  user.area = area;
  user.gender = gender;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot update user (saving user)",
      500
    );
    return next(error);
  }
  res.status(200).json({ user: user.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
  const { userId } = req.body;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot delete user",
      500
    );
    return next(error);
  }

  let ordersList;

  try {
    ordersList = await Orders.find({ userId: userId });
    for (let i = 0; i < ordersList.length; i++) {
      await ordersList[i].remove();
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot delete user new",
      500
    );
    return next(error);
  }

  try {
    await user.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot delete user",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted user" });
};

const findByArea = async (req, res, next) => {
  const { area } = req.body;
  let users;
  try {
    users = await User.find({ area: area }, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any users.",
      500
    );
    return next(error);
  }
  res.json(users);
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any users.",
      500
    );
    return next(error);
  }
  res.json(users);
};

const searchUserByFilter = async (req, res, next) => {
  const { userName, area, gender } = req.body;
  if (area == null || !area) {
    area = ["center"];
  }
  let user;
  try {
    user = await User.find({});
  } catch (err) {}
};

exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.findByArea = findByArea;
exports.getUsers = getUsers;
