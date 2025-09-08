const Post = require("../models/post");

module.exports.allPosts = async (req, res) => {
    const posts = await Post.find({}).populate("author");
    res.render("posts/index", { posts });
}

module.exports.createPost = async (req, res) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    post.date = new Date();
    post.isComment = false;
    await post.save();
    req.flash("success", "Succesfully added post");
    res.redirect("/forum");
}

module.exports.showPost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate("author").populate({
        path: "comments",
        populate: {
            path: "author"
        }
    });
    res.render("posts/show", { post });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render("posts/edit", { post });
}

module.exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { body } = req.body.post;
    const post = await Post.findByIdAndUpdate(id, { body }, { runValidators: true, new: true });
    req.flash("success", "Post updated");
    res.redirect(`/forum/${post._id}`);
}

module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    req.flash("success", "Post deleted");
    res.redirect("/forum");
}

