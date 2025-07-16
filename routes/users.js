const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome!");
            res.redirect("/");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
});

router.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "Already logged in!");
        return res.redirect("/");
    }
    res.render("users/login");
});

router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    console.log("return to", res.locals.returnTo);
    const redirectUrl = res.locals.returnTo || "/";
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged you out");
        res.redirect("/");
    });
})

module.exports = router;