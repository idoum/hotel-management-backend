// src/modules/restaurant/validators/restaurant.validator.js
const Joi = require('joi');

const restaurantSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().max(1000).optional(),
  location: Joi.string().max(255).optional(),
  opening_hours: Joi.string().max(100).optional()
});

const restaurantIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  restaurantSchema,
  restaurantIdParam
};
