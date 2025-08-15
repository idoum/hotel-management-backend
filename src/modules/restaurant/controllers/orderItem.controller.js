const OrderItem = require('../models/orderItem.model');
const MenuItem = require('../models/menuItem.model');
const RestaurantOrder = require('../models/order.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

exports.getAllOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.findAll({ include: [MenuItem, RestaurantOrder] });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getOrderItemById = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id, { include: [MenuItem, RestaurantOrder] });
    if (!item) return res.status(404).json({ message: "Article commande introuvable" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createOrderItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.body.item_id);
    if (!menuItem) return res.status(400).json({ message: 'MenuItem invalide' });

    const order = await RestaurantOrder.findByPk(req.body.order_id);
    if (!order) return res.status(400).json({ message: 'Commande invalide' });

    const item = await OrderItem.create(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'create',
      description: `Création article commande id: ${item.order_item_id}`
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Article commande introuvable" });

    if (req.body.item_id && req.body.item_id !== item.item_id) {
      const menuItem = await MenuItem.findByPk(req.body.item_id);
      if (!menuItem) return res.status(400).json({ message: 'MenuItem invalide' });
    }

    if (req.body.order_id && req.body.order_id !== item.order_id) {
      const order = await RestaurantOrder.findByPk(req.body.order_id);
      if (!order) return res.status(400).json({ message: 'Commande invalide' });
    }

    await item.update(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'update',
      description: `Modification article commande id: ${item.order_item_id}`
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Article commande introuvable" });
    await item.destroy();
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'delete',
      description: `Suppression article commande id: ${item.order_item_id}`
    });
    res.json({ message: "Article commande supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
