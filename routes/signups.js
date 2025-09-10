const express = require("express");
const router = express.Router();
const { validateSignup } = require("../middleware");
const Signup = require("../models/signup");

router.route("/sign-up")
    .get((req, res) => {
        res.render("signupform");
    })
    .post(validateSignup, async (req, res) => {
        const signup = new Signup(req.body);
        await signup.save();
        res.render("signupcomplete");
    })

module.exports = router;