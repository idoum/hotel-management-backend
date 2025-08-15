const RestaurantTable = require('../models/table.model');
const Restaurant = require('../models/restaurant.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

exports.getAllTables = async (req, res) => {
  try {
    const tables = await RestaurantTable.findAll({ include: [Restaurant] });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getTableById = async (req, res) => {
  try {
    const table = await RestaurantTable.findByPk(req.params.id, { include: [Restaurant] });
    if (!table) return res.status(404).json({ message: "Table introuvable" });
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createTable = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurant_id);
    if (!restaurant) return res.status(400).json({ message: 'Restaurant invalide' });
    const table = await RestaurantTable.create(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'create',
      description: `Création table: ${table.name || table.table_id}`
    });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const table = await RestaurantTable.findByPk(req.params.id);
    if (!table) return res.status(404).json({ message: "Table introuvable" });

    if (req.body.restaurant_id && req.body.restaurant_id !== table.restaurant_id) {
      // Vérifie nouvelle association valide
      const restaurant = await Restaurant.findByPk(req.body.restaurant_id);
      if (!restaurant) return res.status(400).json({ message: 'Restaurant invalide' });
    }

    await table.update(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'update',
      description: `Modification table: ${table.name || table.table_id}`
    });
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const table = await RestaurantTable.findByPk(req.params.id);
    if (!table) return res.status(404).json({ message: "Table introuvable" });
    await table.destroy();
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'delete',
      description: `Suppression table: ${table.name || table.table_id}`
    });
    res.json({ message: "Table supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
