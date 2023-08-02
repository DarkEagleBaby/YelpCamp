const Joi = require('joi')


//our joi schema for a campground -> makes it easier to validate the data, and to apply more filters to each attribute

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string(),
        image: Joi.string(),
        description:Joi.string()
    }).required()
})
