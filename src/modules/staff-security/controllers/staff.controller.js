const Staff = require('../models/staff.model');
const Department = require('../models/department.model');
const User = require('../models/user.model');
const ActionLog = require('../models/actionLog.model');

// Récupérer tous les staffs + department
exports.getAllStaff = async (req, res) => {
  try {
    const staffs = await Staff.findAll({ include: Department });
    res.json(staffs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer un staff précis
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id, { include: Department });
    if (!staff) return res.status(404).json({ message: "Personnel introuvable" });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Créer un staff
exports.createStaff = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    await ActionLog.create({
      staff_id: staff.staff_id,
      action_type: 'create',
      description: `Création personnel: ${staff.name}`,
    });
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Modifier un staff
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ message: "Personnel introuvable" });
    await staff.update(req.body);
    await ActionLog.create({
      staff_id: staff.staff_id,
      action_type: 'update',
      description: `Modification personnel: ${staff.name}`,
    });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Supprimer un staff (et supprimer l'utilisateur associé le cas échéant)
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id, { include: User });
    if (!staff) return res.status(404).json({ message: "Personnel introuvable" });
    if (staff.User) await staff.User.destroy();
    await staff.destroy();
    await ActionLog.create({
      staff_id: staff.staff_id,
      action_type: 'delete',
      description: `Suppression personnel: ${staff.name}`,
    });
    res.json({ message: "Personnel supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
