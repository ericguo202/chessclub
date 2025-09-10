const User = require("../models/user");
const Signup = require("../models/signup");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, isAdmin: false });
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
}

module.exports.renderLoginForm = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "Already logged in!");
        return res.redirect("/");
    }
    res.render("users/login");
}

module.exports.login = (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    const redirectUrl = res.locals.returnTo || "/";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged you out");
        res.redirect("/");
    });
}

module.exports.renderDashboard = (req, res) => {
    res.render("users/dashboard", { user: req.user });
}

module.exports.renderChangePasswordForm = (req, res) => {
    res.render("users/changepw");
}

module.exports.changePassword = async (req, res) => {
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
}

module.exports.renderChangeUsernameForm = (req, res) => {
    res.render("users/changeun");
}

module.exports.changeUsername = async (req, res) => {
    const { newUn } = req.body;
    const user = await User.findById(req.user._id);
    user.username = newUn;
    await user.save();

    // logs user back in with new username
    req.login(user, (err) => {
        if (err) return next(err);
        req.flash("success", `Username changed to ${newUn}`);
        res.redirect("/");
    });
}

module.exports.makeAdmin = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { isAdmin: true }, { new: true });
    req.flash("success", "You are now an admin!");
    res.redirect("/dashboard");
}

module.exports.viewSignups = async (req, res) => {
    const signups = await Signup.find({});
    res.render("users/signupDashboard", { signups });
}
