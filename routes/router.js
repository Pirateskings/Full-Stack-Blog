const express = require("express");
const app = express();
const { showRegister, register } = require("../controller/register");
const { showLogin, show, logout } = require("../controller/login");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const postRouter = express.Router();

postRouter.get("/", show);

// register route
postRouter.get("/register", register);

postRouter.post("/register", showRegister);

// login route
postRouter.get("/login", show);

// logout route
postRouter.get("/logout", logout);

// home route
postRouter.get("/home", (req, res) => {
  res.render("home", { title: "Home Page", user: req.user, error: "" });
});

postRouter.post("/login", showLogin);

module.exports = postRouter;
