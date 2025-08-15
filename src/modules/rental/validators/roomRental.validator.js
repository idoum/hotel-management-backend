// src/modules/rental/validators/roomRental.validator.js
const Joi = require('joi');

const roomRentalSchema = Joi.object({
  room_name: Joi.string().min(2).max(255).required(),
  description: Joi.string().max(1000).optional(),
  capacity: Joi.number().integer().min(1).required(),
  location: Joi.string().max(255).optional(),
  price_per_hour: Joi.number().precision(2).min(0).required()
});

const roomRentalIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  roomRentalSchema,
  roomRentalIdParam
};
