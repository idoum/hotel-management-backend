// src/modules/staff-security/validators/staff.validator.js
const Joi = require('joi');

// Validation création/modification staff
const staffSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  age: Joi.number().integer().min(18).max(99),
  contact_info: Joi.string().max(255),
  salary: Joi.number().min(0),
  department_id: Joi.number().integer().required()
});

// Validation paramètre ID
const staffIdParam = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = {
  staffSchema,
  staffIdParam
};
