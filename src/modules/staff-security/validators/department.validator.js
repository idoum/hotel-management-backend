// src/modules/staff-security/validators/department.validator.js
const Joi = require('joi');

// Création/Mise à jour DEPARTMENT
const departmentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  head: Joi.string().max(100).optional(),
  role: Joi.string().max(100).optional(),
  staff_count: Joi.number().integer().min(0).optional()
});

// Paramètre d’URL department_id
const departmentIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  departmentSchema,
  departmentIdParam
};
