const express = require("express");
const {
  getPostForm,
  createPost,
  getPosts,
  getPostById,
  getEditPostForm,
  updatePost,
  deletePost,
} = require("../controller/postController");
const upload = require("../config/multer");
const { ensureAuthenticated } = require("../middlewares/auth");
ensureAuthenticated;
const postRoutes = express.Router();

postRoutes.get("/add", getPostForm);

// post logic
postRoutes.post(
  "/add",
  ensureAuthenticated,
  upload.array("images", 5),
  createPost
);

// get all posts
postRoutes.get("/", ensureAuthenticated, getPosts);

// get post by id
postRoutes.get("/:id", ensureAuthenticated, getPostById);

// edit post
postRoutes.get("/:id/edit", ensureAuthenticated, getEditPostForm);
postRoutes.put(
  "/:id",
  ensureAuthenticated,
  upload.array("images", 5),
  updatePost
);

// delete post
postRoutes.delete("/:id", ensureAuthenticated, deletePost);

module.exports = postRoutes;
