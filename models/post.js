const { date } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: String
    }
});

module.exports = mongoose.model("Post", postSchema);