// src/modules/pool/validators/pool.validator.js
const Joi = require('joi');

const poolSchema = Joi.object({
  nom: Joi.string().min(2).max(255).required(),
  profondeur_max: Joi.number().precision(2).min(0).required(),
  type: Joi.string().valid('intérieure', 'extérieure').required(),
  adresse: Joi.string().max(500).optional().allow(null, '')
});

const poolIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = { poolSchema, poolIdParam };
