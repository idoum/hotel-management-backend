const Staff = require('../models/staff.model');
const Department = require('../models/department.model');
const ActionLog = require('../models/actionLog.model');

// GET tous les membres du personnel
exports.getAllStaff = async (req, res) => {
  try {
    const staffs = await Staff.findAll({
      include: [{ model: Department }],
    });
    res.json(staffs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// GET un staff précis
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id, {
      include: [{ model: Department }],
    });
    if (!staff) return res.status(404).json({ message: 'Personnel introuvable' });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// POST créer un membre du personnel
exports.createStaff = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    await ActionLog.create({
      staff_id: staff.staff_id,
      action_type: 'create',
      description: `Création du personnel: ${staff.name}`,
    });
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// PUT modifier un staff
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Personnel introuvable' });
    await staff.update(req.body);
    await ActionLog.create({
      staff_id: staff.staff_id,
      action_type: 'update',
      description: `Modification du personnel: ${staff.name}`,
    });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// DELETE supprimer un staff
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Personnel introuvable' });
    await staff.destroy();
    await ActionLog.create({
      staff_id: staff.staff_id,
      action_type: 'delete',
      description: `Suppression du personnel: ${staff.name}`,
    });
    res.json({ message: 'Personnel supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
