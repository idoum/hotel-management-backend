const MaintenanceRequest = require('../models/maintenanceRequest.model');
const Staff = require('../../staff-security/models/staff.model');
const Guest = require('../../accommodation/models/guest.model');
const Room = require('../../accommodation/models/room.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

// Liste toutes les demandes de maintenance (avec relations)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.findAll({
      include: [
        { model: Staff, as: 'assigné_technicien' },
        { model: Guest, as: 'demandeur_client' },
        { model: Room, as: 'chambre' }
      ]
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Détail demande par ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByPk(req.params.id, {
      include: [
        { model: Staff, as: 'assigné_technicien' },
        { model: Guest, as: 'demandeur_client' },
        { model: Room, as: 'chambre' }
      ]
    });
    if (!request)
      return res.status(404).json({ message: "Demande introuvable" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Création d’une demande
exports.createRequest = async (req, res) => {
  try {
    // Validation existences FK éventuelles
    if (req.body.demandeur_client_id) {
      const guest = await Guest.findByPk(req.body.demandeur_client_id);
      if (!guest)
        return res.status(400).json({ message: "Client demandeur invalide" });
    }
    if (req.body.assigné_technicien_id) {
      const staff = await Staff.findByPk(req.body.assigné_technicien_id);
      if (!staff)
        return res.status(400).json({ message: "Technicien assigné invalide" });
    }
    if (req.body.chambre_id) {
      const room = await Room.findByPk(req.body.chambre_id);
      if (!room)
        return res.status(400).json({ message: "Chambre invalide" });
    }

    const newRequest = await MaintenanceRequest.create(req.body);

    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'create',
      description: `Création demande maintenance id: ${newRequest.request_id}`
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Mise à jour d’une demande (y compris affectation, statut, priorité)
exports.updateRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByPk(req.params.id);
    if (!request)
      return res.status(404).json({ message: "Demande introuvable" });

    // Vérification FK en cas de modification
    if (
      req.body.demandeur_client_id &&
      req.body.demandeur_client_id !== request.demandeur_client_id
    ) {
      const guest = await Guest.findByPk(req.body.demandeur_client_id);
      if (!guest)
        return res.status(400).json({ message: "Client demandeur invalide" });
    }
    if (
      req.body.assigné_technicien_id &&
      req.body.assigné_technicien_id !== request.assigné_technicien_id
    ) {
      const staff = await Staff.findByPk(req.body.assigné_technicien_id);
      if (!staff)
        return res.status(400).json({ message: "Technicien assigné invalide" });
    }
    if (req.body.chambre_id && req.body.chambre_id !== request.chambre_id) {
      const room = await Room.findByPk(req.body.chambre_id);
      if (!room)
        return res.status(400).json({ message: "Chambre invalide" });
    }

    await request.update(req.body);

    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'update',
      description: `Modification demande maintenance id: ${request.request_id}`
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Suppression d’une demande
exports.deleteRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByPk(req.params.id);
    if (!request)
      return res.status(404).json({ message: "Demande introuvable" });

    await request.destroy();

    await ActionLog.create({
      staff_id: req.user.staffId,
      action_type: 'delete',
      description: `Suppression demande maintenance id: ${request.request_id}`
    });

    res.json({ message: "Demande supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
