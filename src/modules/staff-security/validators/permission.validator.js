// src/modules/staff-security/validators/permission.validator.js
const Joi = require('joi');

// Validation création/modification permission
const permissionSchema = Joi.object({
  permission_name: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(255)
});

// Validation paramètre ID
const permissionIdParam = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = {
  permissionSchema,
  permissionIdParam
};
