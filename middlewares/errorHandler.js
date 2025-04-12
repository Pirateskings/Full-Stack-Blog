const User = require("../models/User");

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    title: "Error Page",
    error: err,
    user: req.user,
  });
};

module.exports = errorHandler;
