// src/modules/restaurant/validators/orderItem.validator.js
const Joi = require('joi');

const orderItemSchema = Joi.object({
  order_id: Joi.number().integer().positive().required(),
  item_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).required()
});

const orderItemIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  orderItemSchema,
  orderItemIdParam
};
