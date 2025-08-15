// src/modules/restaurant/validators/order.validator.js
const Joi = require('joi');

const restaurantOrderSchema = Joi.object({
  table_id: Joi.number().integer().positive().required(),
  staff_id: Joi.number().integer().positive().required(),
  guest_id: Joi.number().integer().positive().optional(),
  order_date: Joi.date().optional() // peut être généré côté serveur
});

const restaurantOrderIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  restaurantOrderSchema,
  restaurantOrderIdParam
};
