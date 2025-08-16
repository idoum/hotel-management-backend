// src/modules/pool/validators/poolReservation.validator.js
const Joi = require('joi');

const poolReservationSchema = Joi.object({
  date: Joi.date().required(),
  heure_debut: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({ 'string.pattern.base': 'Le format doit être HH:mm' }),
  heure_fin: Joi.string()
    .pattern(/^([1]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({ 'string.pattern.base': 'Le format doit être HH:mm' }),
  guest_id: Joi.number().integer().positive().required(),
  staff_id: Joi.number().integer().positive().optional().allow(null),
  pool_id: Joi.number().integer().positive().optional().allow(null),
  nombre_personnes: Joi.number().integer().min(1).required(),
  statut: Joi.string().valid('confirmée', 'annulée', 'en attente').optional()
});

const poolReservationIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = { poolReservationSchema, poolReservationIdParam };
