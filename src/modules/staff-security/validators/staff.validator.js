const Joi = require('joi');

// Schéma de validation pour la création/modification d'un employé
const staffSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.base': 'Le nom doit être une chaîne de caractères',
    'string.empty': 'Le nom ne peut pas être vide',
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 255 caractères',
    'any.required': 'Le nom est obligatoire'
  }),
  
  age: Joi.number().integer().min(16).max(70).optional().allow(null).messages({
    'number.base': 'L\'âge doit être un nombre',
    'number.integer': 'L\'âge doit être un nombre entier',
    'number.min': 'L\'âge minimum est 16 ans',
    'number.max': 'L\'âge maximum est 70 ans'
  }),
  
  contact_info: Joi.string().max(255).optional().allow('', null).messages({
    'string.base': 'Les informations de contact doivent être une chaîne de caractères',
    'string.max': 'Les informations de contact ne peuvent pas dépasser 255 caractères'
  }),
  
  salary: Joi.number().precision(2).min(0).max(999999.99).optional().allow(null).messages({
    'number.base': 'Le salaire doit être un nombre',
    'number.min': 'Le salaire ne peut pas être négatif',
    'number.max': 'Le salaire ne peut pas dépasser 999,999.99'
  }),
  
  department_id: Joi.number().integer().positive().optional().allow(null).messages({
    'number.base': 'L\'ID du département doit être un nombre',
    'number.integer': 'L\'ID du département doit être un nombre entier',
    'number.positive': 'L\'ID du département doit être positif'
  })
});

// Schéma pour la validation des paramètres ID
const staffIdParam = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'L\'ID doit être un nombre',
    'number.integer': 'L\'ID doit être un nombre entier',
    'number.positive': 'L\'ID doit être positif',
    'any.required': 'L\'ID est obligatoire'
  })
});

module.exports = {
  staffSchema,
  staffIdParam
};
