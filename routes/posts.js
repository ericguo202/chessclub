const express = require("express");
const router = express.Router();
const { isLoggedIn, validatePost, isPostAuthorOrAdmin } = require("../middleware");
const posts = require("../controllers/posts");

router.route("/")
    .get(isLoggedIn, posts.allPosts)
    .post(isLoggedIn, validatePost, posts.createPost);

router.route("/:id")
    .get(isLoggedIn, posts.showPost)
    .patch(isLoggedIn, isPostAuthorOrAdmin, posts.updatePost)
    .delete(isLoggedIn, isPostAuthorOrAdmin, posts.deletePost);

router.get("/:id/edit", isLoggedIn, isPostAuthorOrAdmin, posts.renderEditForm);

module.exports = router;