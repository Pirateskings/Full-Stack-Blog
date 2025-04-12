const Comment = require("../models/Comment");
const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

// add comments
exports.addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  // find the post by id
  const post = await Post.findById(postId);
  // validation
  if (!post) {
    return res.render("postDetails", {
      title: "Post Details",
      user: req.user,
      post,
      error: "Post not found",
      success: "",
    });
  }

  if (!content) {
    return res.render("postDetails", {
      title: "Post Details",
      user: req.user,
      post,
      error: "Comment cannot be empty",
      success: "",
    });
  }

  // save the comment
  const comment = new Comment({
    content,
    post: postId,
    author: req.user._id,
  });
  await comment.save();
  // push comment
  post.comments.push(comment._id);
  await post.save();
  console.log(post);
  // redirect
  res.redirect(`/posts/${postId}`);
});

// edit comment
exports.editComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  res.render("editComment", {
    title: "Edit Comment",
    user: req.user,
    comment,
    success: "",
    error: "",
  });
});

// edit comment by id

exports.updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.render("editComment", {
      title: "Edit Comment",
      user: req.user,
      comment,
      error: "Comment not found",
      success: "",
    });
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("editComment", {
      title: "Edit Comment",
      user: req.user,
      comment,
      error: "You are not authorized to update this comment",
      success: "",
    });
  }

  if (!content) {
    return res.render("editComment", {
      title: "Edit Comment",
      user: req.user,
      comment,
      error: "Comment cannot be empty",
      success: "",
    });
  }

  comment.content = content || comment.content;
  await comment.save();
  res.redirect(`/posts/${comment.post}`);
});

// delete comment

exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post Details",
      user: req.user,
      comment,
      error: "You are not authorized to delete this comment",
      success: "",
    });
  }

  await Comment.findByIdAndDelete(req.params.id);
  res.redirect(`/posts/${comment.post}`);
});
