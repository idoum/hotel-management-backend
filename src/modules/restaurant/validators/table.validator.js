// src/modules/restaurant/validators/table.validator.js
const Joi = require('joi');

const tableSchema = Joi.object({
  restaurant_id: Joi.number().integer().positive().required(),
  name: Joi.string().max(100).optional(),
  seats: Joi.number().integer().min(1).required(),
  status: Joi.string().valid('available', 'reserved', 'occupied', 'maintenance').default('available')
});

const tableIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  tableSchema,
  tableIdParam
};
