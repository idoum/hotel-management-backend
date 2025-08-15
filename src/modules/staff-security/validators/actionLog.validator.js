// src/modules/staff-security/validators/actionLog.validator.js
const Joi = require('joi');

// Validation paramètre ID
const logIdParam = Joi.object({
  id: Joi.number().integer().required()
});

// Validation staffId pour recherche logs
const staffIdParam = Joi.object({
  staffId: Joi.number().integer().required()
});

module.exports = {
  logIdParam,
  staffIdParam
};
