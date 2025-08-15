const MenuItem = require('../models/menuItem.model');
const Restaurant = require('../models/restaurant.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.findAll({ include: [Restaurant] });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id, { include: [Restaurant] });
    if (!item) return res.status(404).json({ message: "Menu item introuvable" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurant_id);
    if (!restaurant) return res.status(400).json({ message: 'Restaurant invalide' });
    const item = await MenuItem.create(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'create',
      description: `Création menu item: ${item.name}`
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item introuvable" });

    if (req.body.restaurant_id && req.body.restaurant_id !== item.restaurant_id) {
      const restaurant = await Restaurant.findByPk(req.body.restaurant_id);
      if (!restaurant) return res.status(400).json({ message: 'Restaurant invalide' });
    }

    await item.update(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'update',
      description: `Modification menu item: ${item.name}`
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item introuvable" });
    await item.destroy();
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'delete',
      description: `Suppression menu item: ${item.name}`
    });
    res.json({ message: "Menu item supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
