const Department = require('../models/department.model');

// GET tous les départements
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// POST créer un département
exports.createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
