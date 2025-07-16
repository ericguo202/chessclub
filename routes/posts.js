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
    await post.save();
    req.flash("success", "Succesfully added post");
    res.redirect("/forum");
});

module.exports = router;