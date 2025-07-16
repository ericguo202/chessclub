const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const eventsRouter = require("./routes/events");
const usersRouter = require("./routes/users");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/chessclub')
    .then(() => {
        console.log("Connected to Mongoose");
    }).catch((err) => {
        console.log("Error connecting to Mongoose", err);
    })

// view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// session and flash
const sessionConfig = {
    secret: "thisisnotarealsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        HttpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

//routes
app.use("/events", eventsRouter);
app.use("/", usersRouter);

app.get("/", (req, res) => {
    res.render("home");
});

app.use((req, res) => {
    throw new ExpressError("Page Not Found", 404);
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something Went Wrong" } = err;
    err.status = status;
    err.message = message;
    res.status(status).render("error", { err });
});

app.listen(7860, () => {
    console.log("Listening on port 7860");
});