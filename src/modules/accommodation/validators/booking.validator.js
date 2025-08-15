// src/modules/accommodation/validators/booking.validator.js
const Joi = require('joi');

const bookingSchema = Joi.object({
  guest_id: Joi.number().integer().positive().required(),
  room_id: Joi.number().integer().positive().required(),
  checkin_date: Joi.date().required(),
  checkout_date: Joi.date().min(Joi.ref('checkin_date')).required(),
  staff_id: Joi.number().integer().positive().required(),
  total_price: Joi.number().precision(2).min(0).optional()
});

const bookingIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  bookingSchema,
  bookingIdParam
};
