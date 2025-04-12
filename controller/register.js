const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { set } = require("mongoose");
const asyncHandler = require("express-async-handler");
const register = asyncHandler((req, res) =>
  res.render("register", { title: "Register Page", user: req.user, error: "" })
);

const showRegister = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // alert
      res.render("register", {
        title: "Register Page",
        user: req.user,
        error: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      email,
      password: hashedPassword,
    }).then(() => {
      res.redirect("/auth/");
    });
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      return res.render("register", {
        title: "Register Page",
        user: req.user,
        error: "Something went wrong",
      });
    }, 3000);
  }
});

module.exports = {
  showRegister,
  register,
};
