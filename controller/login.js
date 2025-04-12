const express = require("express");
const app = express();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const asyncHandler = require("express-async-handler");
// login logic
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const show = asyncHandler((req, res) => {
  console.log(req.user);
  return res.render("login", {
    title: "Login Page",
    user: req.user,
    error: "",
  });
});

const showLogin = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render("login", {
        title: "Login Page",
        user: req.user,
        error: "Please check your username and password",
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/auth/home");
    });
  })(req, res, next);
});

const logout = asyncHandler((req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session = null;
    res.redirect("/auth/login");
  });
});

module.exports = {
  showLogin,
  show,
  logout,
};
