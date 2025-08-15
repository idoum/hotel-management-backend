// src/modules/staff-security/validators/role.validator.js
const Joi = require('joi');

// Création/Mise à jour ROLE
const roleSchema = Joi.object({
  role_name: Joi.string().min(2).max(30).required(),
  description: Joi.string().max(255).optional()
});

// Assignation des permissions à un rôle
const assignPermissionsSchema = Joi.object({
  permissionIds: Joi.array().items(Joi.number().integer().positive()).min(1).required()
});

// Paramètre d’URL role_id
const roleIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  roleSchema,
  assignPermissionsSchema,
  roleIdParam
};
