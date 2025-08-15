// src/modules/accommodation/validators/payment.validator.js
const Joi = require('joi');

const paymentSchema = Joi.object({
  booking_id: Joi.number().integer().positive().required(),
  amount: Joi.number().precision(2).min(0).required(),
  method: Joi.string().valid('cash', 'card', 'transfer').required(),
  payment_date: Joi.date().required(),
  staff_id: Joi.number().integer().positive().required()
});

const paymentIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  paymentSchema,
  paymentIdParam
};
