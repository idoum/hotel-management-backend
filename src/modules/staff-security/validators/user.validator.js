const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required().messages({
    'string.base': 'Le nom d\'utilisateur doit être une chaîne de caractères',
    'string.alphanum': 'Le nom d\'utilisateur ne peut contenir que des lettres et chiffres',
    'string.min': 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
    'string.max': 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères',
    'any.required': 'Le nom d\'utilisateur est obligatoire'
  }),
  
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')).required().messages({
    'string.base': 'Le mot de passe doit être une chaîne de caractères',
    'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'string.pattern.base': 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre',
    'any.required': 'Le mot de passe est obligatoire'
  }),
  
  email: Joi.string().email().required().messages({
    'string.base': 'L\'email doit être une chaîne de caractères',
    'string.email': 'L\'email doit avoir un format valide',
    'any.required': 'L\'email est obligatoire'
  }),
  
  staff_id: Joi.number().integer().positive().required().messages({
    'number.base': 'L\'ID de l\'employé doit être un nombre',
    'number.integer': 'L\'ID de l\'employé doit être un nombre entier',
    'number.positive': 'L\'ID de l\'employé doit être positif',
    'any.required': 'L\'ID de l\'employé est obligatoire'
  }),
  
  role_ids: Joi.array().items(Joi.number().integer().positive()).optional().messages({
    'array.base': 'Les rôles doivent être un tableau',
    'number.base': 'Chaque ID de rôle doit être un nombre',
    'number.integer': 'Chaque ID de rôle doit être un nombre entier',
    'number.positive': 'Chaque ID de rôle doit être positif'
  }),
  
  active: Joi.boolean().optional()
});

const userIdParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Le mot de passe actuel est obligatoire'
  }),
  
  newPassword: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')).required().messages({
    'string.min': 'Le nouveau mot de passe doit contenir au moins 8 caractères',
    'string.pattern.base': 'Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre',
    'any.required': 'Le nouveau mot de passe est obligatoire'
  })
});

const updateUserRolesSchema = Joi.object({
  role_ids: Joi.array().items(Joi.number().integer().positive()).required().messages({
    'array.base': 'Les rôles doivent être un tableau',
    'any.required': 'Les rôles sont obligatoires'
  })
});

module.exports = {
  userSchema,
  userIdParam,
  updatePasswordSchema,
  updateUserRolesSchema
};
