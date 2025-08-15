// src/modules/staff-security/validators/permission.validator.js
const Joi = require('joi');

// Création/Mise à jour Permission
const permissionSchema = Joi.object({
  permission_name: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(255).optional()
});

// Paramètre d’URL permission_id
const permissionIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  permissionSchema,
  permissionIdParam
};
