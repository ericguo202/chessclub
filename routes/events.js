const express = require("express");
const router = express.Router();
const { isLoggedIn, validateEvent, isAdmin } = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});
const events = require("../controllers/events");

router.route("/")
    .get(events.allEvents)
    .post(isLoggedIn, isAdmin, upload.single("event[image]"), validateEvent, events.createEvent);

router.get("/new", isLoggedIn, events.renderNewForm);

router.route("/:id")
    .get(events.showEvent)
    .put(isLoggedIn, isAdmin, upload.single("event[image]"), validateEvent, events.updateEvent)
    .delete(isLoggedIn, isAdmin, events.deleteEvent);

router.get("/:id/edit", isLoggedIn, events.renderEditForm);

module.exports = router;