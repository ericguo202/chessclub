const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { isLoggedIn, validateEvent, isAdmin } = require("../middleware");

router.get("/", async (req, res) => {
    const events = await Event.find({});
    res.render("events/index", { events });
});

router.get("/new", isLoggedIn, (req, res) => {
    res.render("events/new");
});

router.post("/", isLoggedIn, isAdmin, validateEvent, async (req, res) => {
    const event = new Event(req.body.event);
    await event.save();
    req.flash("success", "Successfully created event.");
    res.redirect(`/events/${event._id}`);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render("events/show", { event });
});

router.get("/:id/edit", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render("events/edit", { event });
});

router.put("/:id", isLoggedIn, isAdmin, validateEvent, async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body.event, { runValidators: true, new: true });
    req.flash("success", "Successfully updated event.")
    res.redirect(`/events/${event._id}`);
});

router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    req.flash("success", "Event deleted.");
    res.redirect("/events");
});

module.exports = router;