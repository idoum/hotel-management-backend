const Joi = require('joi');

const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    'string.base': 'L\'identifiant doit être une chaîne de caractères',
    'any.required': 'L\'identifiant (username ou email) est obligatoire'
  }),
  
  password: Joi.string().required().messages({
    'string.base': 'Le mot de passe doit être une chaîne de caractères',
    'any.required': 'Le mot de passe est obligatoire'
  })
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'L\'email doit avoir un format valide',
    'any.required': 'L\'email est obligatoire'
  }),
  
  newPassword: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'string.pattern.base': 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre',
    'any.required': 'Le nouveau mot de passe est obligatoire'
  })
});

module.exports = {
  loginSchema,
  resetPasswordSchema
};
