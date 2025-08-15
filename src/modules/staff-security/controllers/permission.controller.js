const Permission = require('../models/permission.model');

// GET toutes les permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// POST créer une permission
exports.createPermission = async (req, res) => {
  try {
    const permission = await Permission.create(req.body);
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
