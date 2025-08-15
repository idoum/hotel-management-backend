// src/modules/staff-security/validators/user.validator.js
const Joi = require('joi');

// Création USER
const userCreateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  staff_id: Joi.number().required(),
  roles: Joi.array().items(Joi.string().min(2)).optional()
});

// Update USER
const userUpdateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  active: Joi.boolean().optional()
});

// Login USER
const userLoginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required()
});

// Changement de mot de passe
const passwordUpdateSchema = Joi.object({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required()
});

// Reset mot de passe par mail
const passwordResetSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(8).required()
});

// Paramètre d’URL user_id
const userIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  userLoginSchema,
  passwordUpdateSchema,
  passwordResetSchema,
  userIdParam
};
