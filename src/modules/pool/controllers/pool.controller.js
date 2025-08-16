// src/modules/pool/controllers/pool.controller.js

const Pool = require('../models/pool.model');
const PoolReservation = require('../models/poolReservation.model');
const Guest = require('../../accommodation/models/guest.model');
const Staff = require('../../staff-security/models/staff.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

// ==== Pool (piscine) ====

// Lister toutes les piscines
exports.getAllPools = async (req, res) => {
  try {
    const pools = await Pool.findAll();
    res.json(pools);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Détail piscine par ID
exports.getPoolById = async (req, res) => {
  try {
    const pool = await Pool.findByPk(req.params.id);
    if (!pool) return res.status(404).json({ message: "Piscine non trouvée" });
    res.json(pool);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Créer une nouvelle piscine
exports.createPool = async (req, res) => {
  try {
    const pool = await Pool.create(req.body);

    await ActionLog.create({
      staff_id: req.user?.staffId || null,
      action_type: 'create_pool',
      description: `Création piscine: ${pool.nom}`
    });

    res.status(201).json(pool);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Mise à jour d'une piscine
exports.updatePool = async (req, res) => {
  try {
    const pool = await Pool.findByPk(req.params.id);
    if (!pool) return res.status(404).json({ message: "Piscine non trouvée" });

    await pool.update(req.body);

    await ActionLog.create({
      staff_id: req.user?.staffId || null,
      action_type: 'update_pool',
      description: `Modification piscine: ${pool.nom}`
    });

    res.json(pool);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Suppression d'une piscine
exports.deletePool = async (req, res) => {
  try {
    const pool = await Pool.findByPk(req.params.id);
    if (!pool) return res.status(404).json({ message: "Piscine non trouvée" });

    // Vérifier qu’il n’y ait pas de réservations associées
    const countReservations = await PoolReservation.count({ where: { pool_id: pool.pool_id } });
    if (countReservations > 0) {
      return res.status(400).json({
        message: "Suppression impossible : piscine avec réservations associées."
      });
    }

    await pool.destroy();

    await ActionLog.create({
      staff_id: req.user?.staffId || null,
      action_type: 'delete_pool',
      description: `Suppression piscine: ${pool.nom}`
    });

    res.json({ message: "Piscine supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ==== PoolReservation (réservations piscine) ====

// Lister toutes les réservations piscine
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await PoolReservation.findAll({
      include: [
        { model: Guest },
        { model: Staff },
        { model: Pool }
      ]
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Détail réservation piscine par ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await PoolReservation.findByPk(req.params.id, {
      include: [
        { model: Guest },
        { model: Staff },
        { model: Pool }
      ]
    });
    if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Création réservation piscine
exports.createReservation = async (req, res) => {
  try {
    // Vérifier clés étrangères
    const guest = await Guest.findByPk(req.body.guest_id);
    if (!guest) return res.status(400).json({ message: "Client invalide" });

    if (req.body.staff_id) {
      const staff = await Staff.findByPk(req.body.staff_id);
      if (!staff) return res.status(400).json({ message: "Staff invalide" });
    }

    if (req.body.pool_id) {
      const pool = await Pool.findByPk(req.body.pool_id);
      if (!pool) return res.status(400).json({ message: "Piscine invalide" });
    }

    const reservation = await PoolReservation.create(req.body);

    await ActionLog.create({
      staff_id: req.user?.staffId || null,
      action_type: 'create_pool_reservation',
      description: `Création réservation piscine id: ${reservation.pool_reservation_id}`
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Mise à jour réservation piscine
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await PoolReservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });

    // Validation clés étrangères en cas de modification
    if (req.body.guest_id && req.body.guest_id !== reservation.guest_id) {
      const guest = await Guest.findByPk(req.body.guest_id);
      if (!guest) return res.status(400).json({ message: "Client invalide" });
    }

    if (req.body.staff_id && req.body.staff_id !== reservation.staff_id) {
      const staff = await Staff.findByPk(req.body.staff_id);
      if (!staff) return res.status(400).json({ message: "Staff invalide" });
    }

    if (req.body.pool_id && req.body.pool_id !== reservation.pool_id) {
      const pool = await Pool.findByPk(req.body.pool_id);
      if (!pool) return res.status(400).json({ message: "Piscine invalide" });
    }

    await reservation.update(req.body);

    await ActionLog.create({
      staff_id: req.user?.staffId || null,
      action_type: 'update_pool_reservation',
      description: `Modification réservation piscine id: ${reservation.pool_reservation_id}`
    });

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Suppression réservation piscine
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await PoolReservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });

    await reservation.destroy();

    await ActionLog.create({
      staff_id: req.user?.staffId || null,
      action_type: 'delete_pool_reservation',
      description: `Suppression réservation piscine id: ${reservation.pool_reservation_id}`
    });

    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
