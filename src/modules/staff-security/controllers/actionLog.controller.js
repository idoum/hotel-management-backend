const ActionLog = require('../models/actionLog.model');
const Staff = require('../models/staff.model');

// GET tous les logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await ActionLog.findAll({ include: [Staff] });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// GET les logs d’un staff
exports.getLogsByStaff = async (req, res) => {
  try {
    const logs = await ActionLog.findAll({ where: { staff_id: req.params.staffId }, include: [Staff] });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
