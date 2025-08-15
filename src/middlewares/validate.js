// src/middlewares/validate.js

/**
 * Middleware générique de validation pour Express utilisant Joi.
 * @param {Joi.Schema} schema - Le schéma de validation Joi à utiliser.
 * @param {string} [property='body'] - Partie de la requête à valider ('body', 'params', 'query').
 * @returns {Function} Middleware Express pour valider la requête.
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    // Utilisation de abortEarly:false pour avoir toutes les erreurs en une fois
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Validation échouée',
        details: error.details.map((d) => d.message)
      });
    }
    next();
  };
};

module.exports = { validate };
