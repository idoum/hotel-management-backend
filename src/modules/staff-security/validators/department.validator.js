// src/modules/staff-security/validators/department.validator.js
const Joi = require('joi');

// Validation création/modification departement
const departmentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  head: Joi.string().max(100),
  role: Joi.string().max(100),
  staff_count: Joi.number().integer().min(0)
});

// Validation paramètre ID
const departmentIdParam = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = {
  departmentSchema,
  departmentIdParam
};
