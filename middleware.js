const ExpressError = require("./utils/ExpressError");
const { eventSchema, postSchema } = require("./joiSchemas");
const Post = require("./models/post");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Please log in");
        return res.redirect("/login");
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        req.flash("error", "You do not have permission to perform this action");
        console.log(req.originalUrl);
        return res.redirect(req.originalUrl);
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
    next();
}

module.exports.validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isPostAuthorOrAdmin = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id) && !req.user.isAdmin) {
        req.flash("error", "You are not allowed to perform this action");
        return res.redirect(`/forum/${post._id}`);
    }
    next();
}

module.exports.isCommentAuthorOrAdmin = async (req, res, next) => {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    const comment = await Post.findById(commentId);
    if (!comment.author.equals(req.user._id) && !req.user.isAdmin) {
        req.flash("error", "You are not allowed to perform this action");
        return res.redirect(`/forum/${post._id}`);
    }
    next();
}