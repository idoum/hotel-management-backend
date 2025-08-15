// src/modules/staff-security/validators/user.validator.js
const Joi = require('joi');

// Validation création utilisateur
const userCreateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  staff_id: Joi.number().required(),
  roles: Joi.array().items(Joi.string().min(2))
});

// Validation modification utilisateur
const userUpdateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
  active: Joi.boolean()
});

// Validation login
const userLoginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required()
});

// Validation modification mot de passe
const passwordUpdateSchema = Joi.object({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required()
});

// Validation reset mot de passe via email
const passwordResetSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(8).required()
});

// Validation paramètre ID
const userIdParam = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  userLoginSchema,
  passwordUpdateSchema,
  passwordResetSchema,
  userIdParam
};
