const Joi = require('joi');

const userCreateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  staff_id: Joi.number().required()
  // Ajoute autres champs selon besoin
});

module.exports = { userCreateSchema };
