// src/modules/staff-security/controllers/department.controller.js
const Department = require('../models/department.model');

// GET : Tous les départements
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// GET : Département par ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Département introuvable" });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// POST : Créer département
exports.createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// PUT : Modifier département
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Département introuvable" });
    await department.update(req.body);
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// DELETE : Supprimer département
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Département introuvable" });
    await department.destroy();
    res.json({ message: "Département supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
