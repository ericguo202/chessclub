const Event = require("../models/event");
const { cloudinary } = require("../cloudinary");

module.exports.allEvents = async (req, res) => {
    const events = await Event.find({});
    res.render("events/index", { events });
}

module.exports.renderNewForm = (req, res) => {
    res.render("events/new");
}

module.exports.createEvent = async (req, res) => {
    const event = new Event(req.body.event);
    if (req.file) {
        event.image = { url: req.file.path, filename: req.file.filename };
    }
    await event.save();
    req.flash("success", "Successfully created event.");
    res.redirect(`/events/${event._id}`);
}

module.exports.showEvent = async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render("events/show", { event });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render("events/edit", { event });
}

module.exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body.event, { runValidators: true, new: true });
    if (req.file) {
        if (event.image.filename) {
            await cloudinary.uploader.destroy(event.image.filename);
        }
        const newImage = { url: req.file.path, filename: req.file.filename };
        event.image = newImage;
        await event.save();
    }
    req.flash("success", "Successfully updated event.")
    res.redirect(`/events/${event._id}`);
}

module.exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (event.image.filename) {
        await cloudinary.uploader.destroy(event.image.filename);
    }
    req.flash("success", "Event deleted.");
    res.redirect("/events");
}
