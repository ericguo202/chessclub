const express = require("express");
const router = express.Router();
const passport = require("passport");
const { storeReturnTo, isLoggedIn } = require("../middleware");
const users = require("../controllers/users");

router.route("/register")
    .get(users.renderRegisterForm)
    .post(users.register);

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login)

router.get("/logout", isLoggedIn, users.logout);

router.get("/dashboard", isLoggedIn, users.renderDashboard);

router.route("/change-password")
    .get(isLoggedIn, users.renderChangePasswordForm)
    .post(isLoggedIn, users.changePassword);

router.post("/admin", isLoggedIn, users.makeAdmin);

module.exports = router;