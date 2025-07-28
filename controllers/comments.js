const Post = require("../models/post");

module.exports.createComment = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const comment = new Post(req.body.post);
    comment.date = new Date().toLocaleString();
    comment.author = req.user._id;
    comment.isComment = true;
    post.comments.push(comment);
    await comment.save();
    await post.save();
    req.flash("success", "Successfully added comment");
    res.redirect(`/forum/${post._id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    const comment = await Post.findByIdAndDelete(commentId);
    req.flash("success", "Deleted comment");
    res.redirect(`/forum/${id}`);
}