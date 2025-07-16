const Joi = require("joi");

module.exports.eventSchema = Joi.object({
    event: Joi.object({
        name: Joi.string().required(),
        date: Joi.string().required(),
        startTime: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0)
    }).required()
});

module.exports.postSchema = Joi.object({
    post: Joi.object({
        body: Joi.string().required()
    }).required()
});


