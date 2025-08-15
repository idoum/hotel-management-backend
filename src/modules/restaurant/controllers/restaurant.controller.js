const Restaurant = require('../models/restaurant.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

exports.getAllRestaurants = async (req, res) => {
  try {
    // Pas de relations directes définies sur Restaurant, on peut juste récupérer les restaurants
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant introuvable" });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'create',
      description: `Création restaurant: ${restaurant.name}`
    });
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant introuvable" });
    await restaurant.update(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'update',
      description: `Modification restaurant: ${restaurant.name}`
    });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, { include: ['RestaurantTables', 'MenuItems'] });
    if (!restaurant) return res.status(404).json({ message: "Restaurant introuvable" });

    // Vérifier qu'il n'a pas de tables ou de menu items associés avant suppression
    const tablesCount = await restaurant.countRestaurantTables();
    const menuCount = await restaurant.countMenuItems();
    if (tablesCount > 0 || menuCount > 0) {
      return res.status(400).json({ message: 'Impossible de supprimer un restaurant avec des tables ou menu items associés' });
    }

    await restaurant.destroy();

    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'delete',
      description: `Suppression restaurant: ${restaurant.name}`
    });
    res.json({ message: "Restaurant supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
