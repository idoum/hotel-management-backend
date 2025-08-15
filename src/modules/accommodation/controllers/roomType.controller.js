const RoomType = require('../models/roomType.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

exports.getAllRoomTypes = async (req, res) => {
  try {
    const types = await RoomType.findAll();
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getRoomTypeById = async (req, res) => {
  try {
    const type = await RoomType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: "Type de chambre introuvable" });
    res.json(type);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createRoomType = async (req, res) => {
  try {
    const type = await RoomType.create(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'create',
      description: `Création type de chambre: ${type.name}`
    });
    res.status(201).json(type);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateRoomType = async (req, res) => {
  try {
    const type = await RoomType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: "Type de chambre introuvable" });
    await type.update(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'update',
      description: `Modification type de chambre: ${type.name}`
    });
    res.json(type);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteRoomType = async (req, res) => {
  try {
    const type = await RoomType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: "Type de chambre introuvable" });
    await type.destroy();
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'delete',
      description: `Suppression type de chambre: ${type.name}`
    });
    res.json({ message: "Type de chambre supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
