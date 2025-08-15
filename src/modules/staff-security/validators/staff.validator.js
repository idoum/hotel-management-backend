// src/modules/staff-security/validators/staff.validator.js
const Joi = require('joi');

// Création/modification STAFF
const staffSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  age: Joi.number().integer().min(18).max(99).optional(),
  contact_info: Joi.string().max(255).optional(),
  salary: Joi.number().min(0).optional(),
  department_id: Joi.number().integer().required()
});

// Valider le paramètre d’URL staff_id
const staffIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  staffSchema,
  staffIdParam
};
