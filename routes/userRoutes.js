const express = require("express");
const upload = require("../config/multer");
const userRoutes = express.Router();
const asyncHandler = require("express-async-handler");
const {
  userProfile,
  editProfile,
  updateProfile,
  deleteProfile,
} = require("../controller/userController");
const { ensureAuthenticated } = require("../middlewares/auth");

// user profile
userRoutes.get("/profile", ensureAuthenticated, userProfile);

// user edit
userRoutes.get("/edit", ensureAuthenticated, editProfile);

userRoutes.post(
  "/profile",
  ensureAuthenticated,
  upload.single("profilePicture"),
  updateProfile
);

userRoutes.post("/delete", ensureAuthenticated, deleteProfile);
module.exports = userRoutes;
