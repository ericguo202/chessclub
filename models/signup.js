const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const signupSchema = new Schema({
    name: String,
    email: String,
    grade: Number,
});

const Signup = mongoose.model("Signup", signupSchema);

module.exports = Signup;