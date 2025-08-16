const RoomRental = require('../models/roomRental.model');
const RentalReservation = require('../models/rentalReservation.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

// Liste toutes les salles
exports.getAllRoomRentals = async (req, res) => {
  try {
    const rentals = await RoomRental.findAll();
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Détail salle par ID
exports.getRoomRentalById = async (req, res) => {
  try {
    const rental = await RoomRental.findByPk(req.params.id);
    if (!rental) return res.status(404).json({ message: "Salle introuvable" });
    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Création d’une salle
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

// Suppression d’une salle (vérification des réservations associées)
exports.deleteRoomRental = async (req, res) => {
  try {
    const rental = await RoomRental.findByPk(req.params.id);
    if (!rental) return res.status(404).json({ message: "Salle introuvable" });

    // Vérifier qu'il n'y a pas de réservations associées
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
