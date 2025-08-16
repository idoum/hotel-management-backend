// src/modules/maintenance/validators/maintenanceRequest.validator.js
const Joi = require('joi');

const maintenanceRequestSchema = Joi.object({
  titre: Joi.string().min(2).max(255).required(),
  description: Joi.string().min(5).max(2000).required(),
  statut: Joi.string().valid('en attente', 'en cours', 'résolue', 'annulée').optional(),
  priorité: Joi.string().valid('faible', 'normale', 'élevée').optional(),
  demandeur_client_id: Joi.number().integer().positive().allow(null),
  assigné_technicien_id: Joi.number().integer().positive().allow(null),
  chambre_id: Joi.number().integer().positive().allow(null),
  créée_le: Joi.date().optional(),
  modifiée_le: Joi.date().optional()
});

const maintenanceRequestIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  maintenanceRequestSchema,
  maintenanceRequestIdParam
};
