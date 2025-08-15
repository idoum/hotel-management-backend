// src/modules/staff-security/controllers/permission.controller.js
const Permission = require('../models/permission.model');

// GET : Toutes les permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// GET : Permission par ID
exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ message: "Permission introuvable" });
    res.json(permission);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// POST : Créer une permission
exports.createPermission = async (req, res) => {
  try {
    const permission = await Permission.create(req.body);
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// PUT : Modifier une permission
exports.updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ message: "Permission introuvable" });
    await permission.update(req.body);
    res.json(permission);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// DELETE : Supprimer une permission
exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ message: "Permission introuvable" });
    await permission.destroy();
    res.json({ message: "Permission supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
