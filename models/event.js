const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: String,
    date: String,
    startTime: String,
    location: String,
    description: String,
    price: Number
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;