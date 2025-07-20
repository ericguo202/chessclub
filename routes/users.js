const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo, isLoggedIn } = require("../middleware");

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
    const redirectUrl = res.locals.returnTo || "/";
    res.redirect(redirectUrl);
});

router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged you out");
        res.redirect("/");
    });
});

router.get("/dashboard", isLoggedIn, (req, res) => {
    res.render("users/dashboard", { user: req.user });
});

router.get("/change-password", isLoggedIn, (req, res) => {
    res.render("users/changepw");
});

router.post("/change-password", isLoggedIn, async (req, res) => {
    const { oldpw, newpw } = req.body;
    const user = await User.findById(req.user._id);
    await user.changePassword(oldpw, newpw, (err) => {
        if (err) {
            req.flash("error", "The password you entered is incorrect");
            return res.redirect("/change-password");
        }
        else {
            req.flash("success", "Successfully changed password!");
            res.redirect("/");
        }
    });
});

module.exports = router;