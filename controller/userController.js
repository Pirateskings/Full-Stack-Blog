const express = require("express");
const app = express();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const File = require("../models/FileUpload");
// get user profile

exports.userProfile = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const user = await User.findById(req.user._id).select("-password").lean();

  if (!user) {
    return res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found",
      success: "",
    });
  }

  //   fetch user's posts
  const posts = await Post.find({ author: req.user._id }).sort({
    createdAt: -1,
  });

  res.render("profile", {
    title: "Profile",
    user,
    posts,
    success: "",
    error: "",
    postCount: posts.length,
  });
});

// edit user profile
exports.editProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").lean();

  if (!user) {
    return res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found",
      success: "",
    });
  }

  res.render("editProfile", {
    title: "Edit Profile",
    user,
    success: "",
    error: "",
  });
});

// update user profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { username, email, bio } = req.body;

  let user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found",
      success: "",
    });
  }

  if (!username && !email) {
    return res.render("editProfile", {
      title: "Edit Profile",
      user,
      error: "Name and email cannot be empty",
      success: "",
    });
  }

  // Update user fields
  user.username = username || user.username;
  user.email = email || user.email;
  user.bio = bio || user.bio;

  if (req.file) {
    // Delete old profile picture from Cloudinary if it exists
    if (user.profilePicture && user.profilePicture.public_id) {
      await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }

    // Upload new file
    const file = new File({
      url: req.file.path,
      public_id: req.file.filename,
      uploaded_by: req.user._id,
    });

    await file.save();

    user.profilePicture = {
      url: file.url,
      public_id: file.public_id,
    };
  }

  // Save updated user profile
  await user.save();

  res.redirect("/user/profile");
});

// delete user profile
exports.deleteProfile = asyncHandler(async (req, res) => {
  // Fetch user and populate posts and files
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("posts")
    .populate("comments")
    .lean();

  if (!user) {
    return res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found",
      success: "",
    });
  }

  // Delete post images from Cloudinary
  if (user.posts && Array.isArray(user.posts)) {
    await Promise.all(
      user.posts.map(async (post) => {
        if (post.images && post.images.public_id) {
          await cloudinary.uploader.destroy(post.images.public_id);
        }
      })
    );
  }

  // Delete profile picture from Cloudinary
  if (user.profilePicture && user.profilePicture.public_id) {
    await cloudinary.uploader.destroy(user.profilePicture.public_id);
  }

  // Delete user's posts and files from the database
  await Post.deleteMany({ author: req.user._id });
  await File.deleteMany({ uploaded_by: req.user._id });
  await Comment.deleteMany({ author: req.user._id });

  // Delete the user
  await User.findByIdAndDelete(req.user._id);

  res.redirect("/auth/logout");
});
