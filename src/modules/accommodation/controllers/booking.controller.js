const Booking = require('../models/booking.model');
const Room = require('../models/room.model');
const Guest = require('../models/guest.model');
const Staff = require('../../staff-security/models/staff.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

// GET toute les réservations avec les entités liées
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ include: [Room, Guest, Staff] });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// GET réservation par ID avec ses associations
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: [Room, Guest, Staff] });
    if (!booking) return res.status(404).json({ message: "Réservation introuvable" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// POST création réservation avec vérification FK
exports.createBooking = async (req, res) => {
  try {
    // Vérifier l'existence des entités liées
    const guest = await Guest.findByPk(req.body.guest_id);
    if (!guest) return res.status(400).json({ message: "Client invalide" });

    const room = await Room.findByPk(req.body.room_id);
    if (!room) return res.status(400).json({ message: "Chambre invalide" });

    const staff = await Staff.findByPk(req.body.staff_id);
    if (!staff) return res.status(400).json({ message: "Staff invalide" });

    const booking = await Booking.create(req.body);

    await ActionLog.create({
      staff_id: booking.staff_id,
      action_type: 'create',
      description: `Création réservation id: ${booking.booking_id}`
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// PUT mise à jour réservation avec vérification FK en cas de modification
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Réservation introuvable" });

    if (req.body.guest_id && req.body.guest_id !== booking.guest_id) {
      const guest = await Guest.findByPk(req.body.guest_id);
      if (!guest) return res.status(400).json({ message: "Client invalide" });
    }

    if (req.body.room_id && req.body.room_id !== booking.room_id) {
      const room = await Room.findByPk(req.body.room_id);
      if (!room) return res.status(400).json({ message: "Chambre invalide" });
    }

    if (req.body.staff_id && req.body.staff_id !== booking.staff_id) {
      const staff = await Staff.findByPk(req.body.staff_id);
      if (!staff) return res.status(400).json({ message: "Staff invalide" });
    }

    await booking.update(req.body);

    await ActionLog.create({
      staff_id: booking.staff_id,
      action_type: 'update',
      description: `Modification réservation id: ${booking.booking_id}`
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// DELETE réservation
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Réservation introuvable" });

    await booking.destroy();

    await ActionLog.create({
      staff_id: booking.staff_id,
      action_type: 'delete',
      description: `Suppression réservation id: ${booking.booking_id}`
    });

    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// GET réservations par guestId (filtrage)
exports.getBookingsByGuestId = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { guest_id: req.params.guestId },
      include: [Room, Guest, Staff]
    });
    if (bookings.length === 0) return res.status(404).json({ message: "Aucune réservation trouvée pour ce client" });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
