const Joi = require('joi');

const rentalReservationSchema = Joi.object({
  rental_id: Joi.number().integer().positive().required(),
  guest_id: Joi.number().integer().positive().required(),
  staff_id: Joi.number().integer().positive().required(),
  start_datetime: Joi.date().required(),
  end_datetime: Joi.date().min(Joi.ref('start_datetime')).required(),
  total_price: Joi.number().precision(2).min(0).required(),
  status: Joi.string().valid('booked', 'cancelled', 'completed').optional()
});

const reservationIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  rentalReservationSchema,
  reservationIdParam
};
