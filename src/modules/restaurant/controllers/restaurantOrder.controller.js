const RestaurantOrder = require('../models/order.model');
const RestaurantTable = require('../models/table.model');
const Staff = require('../../staff-security/models/staff.model');
const Guest = require('../../accommodation/models/guest.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await RestaurantOrder.findAll({ include: [RestaurantTable, Staff, Guest] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await RestaurantOrder.findByPk(req.params.id, { include: [RestaurantTable, Staff, Guest] });
    if (!order) return res.status(404).json({ message: "Commande introuvable" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const table = await RestaurantTable.findByPk(req.body.table_id);
    if (!table) return res.status(400).json({ message: 'Table invalide' });

    if (req.body.guest_id) {
      // Si guest_id fourni, vérifier son existence
      const guest = await Guest.findByPk(req.body.guest_id);
      if (!guest) return res.status(400).json({ message: 'Client invalide' });
    }

    const order = await RestaurantOrder.create(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'create',
      description: `Création commande id: ${order.order_id}`
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await RestaurantOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Commande introuvable" });

    if (req.body.table_id && req.body.table_id !== order.table_id) {
      const table = await RestaurantTable.findByPk(req.body.table_id);
      if (!table) return res.status(400).json({ message: 'Table invalide' });
    }

    if (req.body.guest_id && req.body.guest_id !== order.guest_id) {
      const guest = await Guest.findByPk(req.body.guest_id);
      if (!guest) return res.status(400).json({ message: 'Client invalide' });
    }

    await order.update(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'update',
      description: `Modification commande id: ${order.order_id}`
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await RestaurantOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Commande introuvable" });
    await order.destroy();
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'delete',
      description: `Suppression commande id: ${order.order_id}`
    });
    res.json({ message: "Commande supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
