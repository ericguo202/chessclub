const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const { isLoggedIn, validatePost } = require("../middleware");

router.get("/forum", isLoggedIn, async (req, res) => {
    const posts = await Post.find({}).populate("author");
    res.render("posts/index", { posts });
});

router.post("/forum", isLoggedIn, validatePost, async (req, res) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    post.date = new Date().toLocaleString();
    await post.save();
    req.flash("success", "Succesfully added post");
    res.redirect("/forum");
});

router.get("/forum/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate("author");
    res.render("posts/show", { post });
});

router.get("/forum/:id/edit", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render("posts/edit", { post });
});

router.patch("/forum/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { body } = req.body.post;
    const post = await Post.findByIdAndUpdate(id, { body }, { runValidators: true, new: true });
    req.flash("success", "Post updated");
    res.redirect(`/forum/${post._id}`);
});

router.delete("/forum/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    req.flash("success", "Post deleted");
    res.redirect("/forum");
});

module.exports = router;