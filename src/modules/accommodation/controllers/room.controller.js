const Room = require('../models/room.model');
const RoomType = require('../models/roomType.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({ include: [RoomType] });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id, { include: [RoomType] });
    if (!room) return res.status(404).json({ message: "Chambre introuvable" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'create',
      description: `Création chambre numero: ${room.number}`
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Chambre introuvable" });
    await room.update(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'update',
      description: `Modification chambre numero: ${room.number}`
    });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Chambre introuvable" });
    await room.destroy();
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'delete',
      description: `Suppression chambre numero: ${room.number}`
    });
    res.json({ message: "Chambre supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
