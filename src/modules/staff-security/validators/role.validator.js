// src/modules/staff-security/validators/role.validator.js
const Joi = require('joi');

// Validation création/modification rôle
const roleSchema = Joi.object({
  role_name: Joi.string().min(2).max(30).required(),
  description: Joi.string().max(255)
});

// Validation assignation de permissions à un rôle
const assignPermissionsSchema = Joi.object({
  permissionIds: Joi.array().items(Joi.number().integer()).min(1).required()
});

// Validation paramètre ID
const roleIdParam = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = {
  roleSchema,
  assignPermissionsSchema,
  roleIdParam
};
