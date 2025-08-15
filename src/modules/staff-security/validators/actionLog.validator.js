// src/modules/staff-security/validators/actionLog.validator.js
const Joi = require('joi');

// Paramètre d’URL log_id
const logIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

// Paramètre URL staffId pour recherche des logs
const staffIdParam = Joi.object({
  staffId: Joi.number().integer().positive().required()
});

module.exports = {
  logIdParam,
  staffIdParam
};
