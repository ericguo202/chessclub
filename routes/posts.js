const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const { isLoggedIn, validatePost, isPostAuthor } = require("../middleware");

router.get("/", isLoggedIn, async (req, res) => {
    const posts = await Post.find({}).populate("author");
    res.render("posts/index", { posts });
});

router.post("/", isLoggedIn, validatePost, async (req, res) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    post.date = new Date().toLocaleString();
    post.isComment = false;
    await post.save();
    req.flash("success", "Succesfully added post");
    res.redirect("/forum");
});

router.get("/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate("author").populate({
        path: "comments",
        populate: {
            path: "author"
        }
    });
    res.render("posts/show", { post });
});

router.get("/:id/edit", isLoggedIn, isPostAuthor, async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render("posts/edit", { post });
});

router.patch("/:id", isLoggedIn, isPostAuthor, async (req, res) => {
    const { id } = req.params;
    const { body } = req.body.post;
    const post = await Post.findByIdAndUpdate(id, { body }, { runValidators: true, new: true });
    req.flash("success", "Post updated");
    res.redirect(`/forum/${post._id}`);
});

router.delete("/:id", isLoggedIn, isPostAuthor, async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    req.flash("success", "Post deleted");
    res.redirect("/forum");
});

module.exports = router;