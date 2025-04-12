const express = require("express");
const {
  addComment,
  editComment,
  updateComment,
  deleteComment,
} = require("../controller/commentController");
const { ensureAuthenticated } = require("../middlewares/auth");
const commentRoutes = express.Router();

// add comment form
commentRoutes.post("/posts/:id/comments", ensureAuthenticated, addComment);

// edit comment
commentRoutes.get("/comments/:id/edit", ensureAuthenticated, editComment);
commentRoutes.put("/comments/:id", ensureAuthenticated, updateComment);

// delete comment
commentRoutes.delete("/comments/:id", ensureAuthenticated, deleteComment);

module.exports = commentRoutes;
