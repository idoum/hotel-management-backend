const RoomRental = require('../models/roomRental.model');
const RentalReservation = require('../models/rentalReservation.model');
const Guest = require('../../accommodation/models/guest.model');
const Staff = require('../../staff-security/models/staff.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

// Liste toutes les salles disponibles
exports.getAllRoomRentals = async (req, res) => {
  try {
    const rentals = await RoomRental.findAll();
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupère une salle par ID
exports.getRoomRentalById = async (req, res) => {
  try {
    const rental = await RoomRental.findByPk(req.params.id);
    if (!rental) return res.status(404).json({ message: "Salle introuvable" });
    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Création d’une nouvelle salle
exports.createRoomRental = async (req, res) => {
  try {
    const rental = await RoomRental.create(req.body);
    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'create',
      description: `Création salle: ${rental.room_name}`
    });
    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Mise à jour d’une salle
exports.updateRoomRental = async (req, res) => {
  try {
    const rental = await RoomRental.findByPk(req.params.id);
    if (!rental) return res.status(404).json({ message: "Salle introuvable" });

    await rental.update(req.body);

    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'update',
      description: `Modification salle: ${rental.room_name}`
    });

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Suppression d’une salle en tenant compte des réservations associées
exports.deleteRoomRental = async (req, res) => {
  try {
    const rental = await RoomRental.findByPk(req.params.id);
    if (!rental) return res.status(404).json({ message: "Salle introuvable" });

    // Vérifier si la salle a des réservations
    const countReservations = await RentalReservation.count({ where: { rental_id: rental.rental_id } });
    if (countReservations > 0) {
      return res.status(400).json({
        message: "Suppression impossible : la salle possède des réservations associées."
      });
    }

    await rental.destroy();

    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'delete',
      description: `Suppression salle: ${rental.room_name}`
    });

    res.json({ message: "Salle supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


// Liste toutes les réservations pour les salles
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await RentalReservation.findAll({
      include: [RoomRental, Guest, Staff]
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer une réservation par ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await RentalReservation.findByPk(req.params.id, {
      include: [RoomRental, Guest, Staff]
    });
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Création d’une réservation avec vérifications FK
exports.createReservation = async (req, res) => {
  try {
    const roomRental = await RoomRental.findByPk(req.body.rental_id);
    if (!roomRental) return res.status(400).json({ message: "Salle invalide" });

    const guest = await Guest.findByPk(req.body.guest_id);
    if (!guest) return res.status(400).json({ message: "Client invalide" });

    const staff = await Staff.findByPk(req.body.staff_id);
    if (!staff) return res.status(400).json({ message: "Staff invalide" });

    const reservation = await RentalReservation.create(req.body);

    await ActionLog.create({
      staff_id: reservation.staff_id,
      action_type: 'create',
      description: `Création réservation salle id: ${reservation.reservation_id}`
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Mise à jour d’une réservation avec vérifications FK éventuelles
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await RentalReservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });

    if (req.body.rental_id && req.body.rental_id !== reservation.rental_id) {
      const roomRental = await RoomRental.findByPk(req.body.rental_id);
      if (!roomRental) return res.status(400).json({ message: "Salle invalide" });
    }

    if (req.body.guest_id && req.body.guest_id !== reservation.guest_id) {
      const guest = await Guest.findByPk(req.body.guest_id);
      if (!guest) return res.status(400).json({ message: "Client invalide" });
    }

    if (req.body.staff_id && req.body.staff_id !== reservation.staff_id) {
      const staff = await Staff.findByPk(req.body.staff_id);
      if (!staff) return res.status(400).json({ message: "Staff invalide" });
    }

    await reservation.update(req.body);

    await ActionLog.create({
      staff_id: reservation.staff_id,
      action_type: 'update',
      description: `Modification réservation salle id: ${reservation.reservation_id}`
    });

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Suppression d’une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await RentalReservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });

    await reservation.destroy();

    await ActionLog.create({
      staff_id: reservation.staff_id,
      action_type: 'delete',
      description: `Suppression réservation salle id: ${reservation.reservation_id}`
    });

    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
