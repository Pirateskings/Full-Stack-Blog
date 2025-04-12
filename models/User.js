const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { match } = require("assert");
const { type } = require("os");

// create schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: /@/,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    bio: {
      type: String,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
