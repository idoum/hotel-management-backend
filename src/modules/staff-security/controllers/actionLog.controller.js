// src/modules/staff-security/controllers/actionLog.controller.js
const ActionLog = require('../models/actionLog.model');
const Staff = require('../models/staff.model');

// GET : Tous les logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await ActionLog.findAll({ include: [Staff] });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// GET : Logs par staff
exports.getLogsByStaff = async (req, res) => {
  try {
    const logs = await ActionLog.findAll({ where: { staff_id: req.params.staffId }, include: [Staff] });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// DELETE : Suppression log
exports.deleteLog = async (req, res) => {
  try {
    const log = await ActionLog.findByPk(req.params.id);
    if (!log) return res.status(404).json({ message: "Log introuvable" });
    await log.destroy();
    res.json({ message: "Log supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
