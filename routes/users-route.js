const { RotateRight } = require("@mui/icons-material");
const express = require("express");
const { check } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");

const router = express.Router();
// get all users
router.get("getUsers", usersControllers.getUsers);
//signup with validators
router.post(
  "/signup",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength(6),
    check("userName").not().isEmpty(),
    check("area").not().isEmpty(),
    check("gender").not().isEmpty(),
  ],
  usersControllers.signup
);
// login
router.post("/login", usersControllers.login);
// update
router.patch("/update", usersControllers.updateUser);
//delete
router.post("/delete", usersControllers.deleteUser);
//serch by 1 filter
router.post("/findByArea", usersControllers.findByArea);

module.exports = router;
