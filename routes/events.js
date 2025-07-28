const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { isLoggedIn, validateEvent, isAdmin } = require("../middleware");
const multer = require("multer");
const {storage, cloudinary} = require("../cloudinary");
const upload = multer({storage});

router.get("/", async (req, res) => {
    const events = await Event.find({});
    res.render("events/index", { events });
});

router.get("/new", isLoggedIn, (req, res) => {
    res.render("events/new");
});

router.post("/", isLoggedIn, isAdmin, upload.single("event[image]"), validateEvent, async (req, res) => {
    console.log(req.body, req.file);
    const event = new Event(req.body.event);
    if (req.file) {
        event.image = {url: req.file.path, filename: req.file.filename};
    }
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

router.put("/:id", isLoggedIn, isAdmin, upload.single("event[image]"), validateEvent, async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body.event, { runValidators: true, new: true });
    if (req.file) {
        if (event.image.filename) {
            await cloudinary.uploader.destroy(event.image.filename);
        }
        const newImage = {url: req.file.path, filename: req.file.filename};
        event.image = newImage;
        await event.save();
    }
    console.log(event);
    req.flash("success", "Successfully updated event.")
    res.redirect(`/events/${event._id}`);
});

router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (event.image.filename) {
        await cloudinary.uploader.destroy(event.image.filename);
    }
    req.flash("success", "Event deleted.");
    res.redirect("/events");
});

module.exports = router;