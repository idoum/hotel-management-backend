const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');
const Staff = require('../../staff-security/models/staff.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({ include: [Booking, Staff] });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, { include: [Booking, Staff] });
    if (!payment) return res.status(404).json({ message: "Paiement introuvable" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    await ActionLog.create({
      staff_id: payment.staff_id,
      action_type: 'create',
      description: `Création paiement id: ${payment.payment_id}`
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Paiement introuvable" });
    await payment.update(req.body);
    await ActionLog.create({
      staff_id: payment.staff_id,
      action_type: 'update',
      description: `Modification paiement id: ${payment.payment_id}`
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Paiement introuvable" });
    await payment.destroy();
    await ActionLog.create({
      staff_id: payment.staff_id,
      action_type: 'delete',
      description: `Suppression paiement id: ${payment.payment_id}`
    });
    res.json({ message: "Paiement supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
exports.getPaymentsByBookingId = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { booking_id: req.params.bookingId },
      include: [Booking, Staff]
    });
    if (payments.length === 0) return res.status(404).json({ message: "Aucun paiement trouvé pour cette réservation" });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};