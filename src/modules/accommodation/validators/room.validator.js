// src/modules/accommodation/validators/room.validator.js
const Joi = require('joi');

const roomSchema = Joi.object({
  number: Joi.string().min(1).max(50).required(),
  type_id: Joi.number().integer().positive().required(),
  status: Joi.string().valid('available', 'occupied', 'maintenance', 'reserved').default('available'),
  floor: Joi.number().integer().optional(),
  description: Joi.string().max(1000).optional()
});

const roomIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  roomSchema,
  roomIdParam
};
