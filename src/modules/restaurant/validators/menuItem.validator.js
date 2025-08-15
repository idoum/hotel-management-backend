// src/modules/restaurant/validators/menuItem.validator.js
const Joi = require('joi');

const menuItemSchema = Joi.object({
  restaurant_id: Joi.number().integer().positive().required(),
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  price: Joi.number().precision(2).min(0).required(),
  category: Joi.string().max(100).optional()
});

const menuItemIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  menuItemSchema,
  menuItemIdParam
};
