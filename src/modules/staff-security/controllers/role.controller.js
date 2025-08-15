const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const RolePermission = require('../models/rolePermission.model');

// GET tous les rôles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({ include: [Permission] });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// POST créer un rôle
exports.createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// POST assigner des permissions à un rôle
exports.assignPermissionsToRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissionIds } = req.body;
    for (let pid of permissionIds) {
      await RolePermission.findOrCreate({ where: { role_id: roleId, permission_id: pid } });
    }
    res.json({ message: 'Permissions assignées au rôle' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
