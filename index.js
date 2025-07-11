const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Event = require("./models/event");
const ExpressError = require("./utils/ExpressError");
const { eventSchema } = require("./joiSchemas");

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/chessclub')
    .then(() => {
        console.log("Connected to Mongoose");
    }).catch((err) => {
        console.log("Error connecting to Mongoose", err);
    })

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/events", async (req, res) => {
    const events = await Event.find({});
    res.render("events/index", { events });
});

app.get("/events/new", (req, res) => {
    res.render("events/new");
});

app.post("/events", validateEvent, async (req, res) => {
    const event = new Event(req.body.event);
    await event.save();
    res.redirect(`/events/${event._id}`);
});

app.get("/events/:id", async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render("events/show", { event });
});

app.get("/events/:id/edit", async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render("events/edit", { event });
});

app.put("/events/:id", validateEvent, async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body.event, { runValidators: true, new: true });
    res.redirect(`/events/${event._id}`);
});

app.delete("/events/:id", async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    res.redirect("/events");
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