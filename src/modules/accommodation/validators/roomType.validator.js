// src/modules/accommodation/validators/roomType.validator.js
const Joi = require('joi');

const roomTypeSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().max(1000).optional(),
  price_per_night: Joi.number().precision(2).min(0).required(),
  capacity: Joi.number().integer().min(1).required()
});

const roomTypeIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  roomTypeSchema,
  roomTypeIdParam
};
