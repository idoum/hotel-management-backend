const Booking = require('../models/booking.model');
const Room = require('../models/room.model');
const Guest = require('../models/guest.model');
const Staff = require('../../staff-security/models/staff.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ include: [Room, Guest, Staff] });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: [Room, Guest, Staff] });
    if (!booking) return res.status(404).json({ message: "Réservation introuvable" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createBooking = async (req, res) => {
  try {
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

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Réservation introuvable" });
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