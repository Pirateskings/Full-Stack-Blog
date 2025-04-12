const { url } = require("../config/cloudinary");
const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const File = require("../models/FileUpload");
// render post details
exports.getPostForm = asyncHandler((req, res) => {
  res.render("newPost", {
    title: "Add Post",
    user: req.user,
    success: "",
    error: "",
  });
});

exports.createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  //  validation
  // if (!req.files || req.files.length === 0) {
  //   return res.render("newPost", {
  //     title: "Add Post",
  //     user: req.user,
  //     error: "Please upload at least one image.",
  //     success: "",
  //   });
  // }
  const images = await Promise.all(
    req.files.map(async (file) => {
      // save the images into database
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      console.log(newFile);
      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    })
  );

  await Post.create({
    title,
    content,
    author: req.user._id,
    images,
  });

  res.render("newPost", {
    title: "Add Post",
    user: req.user,
    success: "Post created Successfully",
    error: "",
  });
});

// Get all posts
exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .populate("author", "username")
    .lean();
  res.render("posts", {
    title: "All Posts",
    user: req.user,
    posts,
    success: "",
    error: "",
  });
});

// get post by id

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
        select: "username",
      },
    })
    .lean();

  res.render("postDetails", {
    title: "Post Details",
    user: req.user,
    post,
    success: "",
    error: "",
  });
});

// get edit post form
exports.getEditPostForm = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).lean();

  if (!post) {
    return res.render("postDetails", {
      title: "Post Details",
      user: req.user,
      post,
      error: "Post not found",
      success: "",
    });
  }

  res.render("editPost", {
    title: "Edit Post",
    user: req.user,
    post,
    success: "",
    error: "",
  });
});

// update post
exports.updatePost = asyncHandler(async (req, res) => {
  const { title, content, images } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.render("postDetails", {
      title: "Post Details",
      user: req.user,
      post,
      error: "Post not found",
      success: "",
    });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    res.render("postDetails", {
      title: "Post Details",
      user: req.user,
      post,
      success: "You are not authorized to update this post",
      error: "",
    });
  }

  if (req.files && req.files.length > 0) {
    await Promise.all(
      post.images.map(async (image) => {
        await cloudinary.uploader.destroy(image.public_id);
      })
    );
  }

  post.images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    })
  );
  post.title = title || post.title;
  post.content = content || post.content;

  await post.save();
  res.redirect(`/posts/${post._id}`);
});

// delete post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.render("postDetails", {
      title: "Post Details",
      user: req.user,
      post,
      error: "Post not found",
      success: "",
    });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post Details",
      user: req.user,
      post,
      error: "You are not authorized to delete this post",
      success: "",
    });
  }

  await Promise.all(
    post.images.map(async (image) => {
      await cloudinary.uploader.destroy(image.public_id);
    })
  );

  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});
