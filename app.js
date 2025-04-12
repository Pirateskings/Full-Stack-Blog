require("dotenv").config();
const express = require("express");
const app = express();
const connectMongo = require("connect-mongo");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const postRouter = require("./routes/router");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./config/passport");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const postRoutes = require("./routes/postRoute");
const errorHandler = require("./middlewares/errorHandler");
const commentRoutes = require("./routes/commentRoute");
const userRoutes = require("./routes/userRoutes");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// session middleware
app.use(
  session({
    secret: process.env.TOKEN_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

// method override middleware
app.use(methodOverride("_method"));

// passport config
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", postRouter);
// post routes
app.use("/posts", postRoutes);
// error handler
app.use(errorHandler);
// comment routes
app.use("/", commentRoutes);
// user routes
app.use("/user", userRoutes);
// connect the database
const DB = mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("connected to database");
});
// start the server
DB.then(() => {
  app.listen(port, () =>
    console.log(`Example app listening on port http://localhost:${port}/auth`)
  );
}).catch((err) => {
  console.log(err);
});
