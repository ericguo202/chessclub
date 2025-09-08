const { date } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    body: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date
    },
    isComment: {
        type: Boolean
    },
    comments: [
        { type: Schema.Types.ObjectId, ref: "Post" }
    ]
});

postSchema.post("findOneAndDelete", async (post) => {
    if (post.comments) {
        await Post.deleteMany({ _id: { $in: post.comments } });
    }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;