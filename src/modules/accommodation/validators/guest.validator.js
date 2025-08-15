// src/modules/accommodation/validators/guest.validator.js
const Joi = require('joi');

const guestSchema = Joi.object({
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().min(1).max(100).required(),
  dob: Joi.date().optional(),
  address: Joi.string().max(255).optional(),
  phone: Joi.string().max(20).optional(),
  email: Joi.string().email().optional()
});

const guestIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  guestSchema,
  guestIdParam
};
