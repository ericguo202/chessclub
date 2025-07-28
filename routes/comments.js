const express = require("express");
const router = express.Router();
const { isLoggedIn, validatePost, isCommentAuthorOrAdmin } = require("../middleware");
const comments = require("../controllers/comments");

router.post("/forum/:id/comments", isLoggedIn, validatePost, comments.createComment);

router.delete("/forum/:id/comments/:commentId", isLoggedIn, isCommentAuthorOrAdmin, comments.deleteComment);

module.exports = router;