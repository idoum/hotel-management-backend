const Guest = require('../models/guest.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

exports.getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.findAll();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) return res.status(404).json({ message: "Client introuvable" });
    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createGuest = async (req, res) => {
  try {
    const guest = await Guest.create(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'create',
      description: `Création client: ${guest.first_name} ${guest.last_name}`
    });
    res.status(201).json(guest);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) return res.status(404).json({ message: "Client introuvable" });
    await guest.update(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'update',
      description: `Modification client: ${guest.first_name} ${guest.last_name}`
    });
    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) return res.status(404).json({ message: "Client introuvable" });
    await guest.destroy();
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'delete',
      description: `Suppression client: ${guest.first_name} ${guest.last_name}`
    });
    res.json({ message: "Client supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
