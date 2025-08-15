const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const RolePermission = require('../models/rolePermission.model');

// Récupérer tous les rôles + permissions associées
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({ include: [Permission] });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer un rôle par son ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, { include: [Permission] });
    if (!role) return res.status(404).json({ message: "Rôle introuvable" });
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Créer un rôle
exports.createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Modifier un rôle
exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Rôle introuvable" });
    await role.update(req.body);
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Supprimer un rôle
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Rôle introuvable" });
    await role.destroy();
    res.json({ message: "Rôle supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Assigner des permissions
exports.assignPermissionsToRole = async (req, res) => {
  try {
    const { permissionIds } = req.body;
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Rôle introuvable" });
    for (let pid of permissionIds) {
      await RolePermission.findOrCreate({ where: { role_id: role.role_id, permission_id: pid } });
    }
    res.json({ message: "Permissions assignées au rôle" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
