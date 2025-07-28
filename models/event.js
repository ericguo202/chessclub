const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: String,
    date: String,
    startTime: String,
    location: String,
    description: String,
    price: Number,
    image: {
        url: String,
        filename: String
    }
});

eventSchema.virtual("dateTime").get(function() {
    const dateTime = new Date(`${this.date}T${this.startTime}`);
    return dateTime;
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;