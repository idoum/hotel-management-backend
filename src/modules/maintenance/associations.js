const MaintenanceRequest = require('./models/maintenanceRequest.model');
const Staff = require('../staff-security/models/staff.model');
const Guest = require('../accommodation/models/guest.model');
const Room = require('../accommodation/models/room.model');

// Lien -> Request assignée à staff (technicien)
Staff.hasMany(MaintenanceRequest, {
  foreignKey: 'assigned_to_staff_id',
  onDelete: 'SET NULL',   // Si staff supprimé : assigne à null mais garde la demande
  onUpdate: 'CASCADE'
});
MaintenanceRequest.belongsTo(Staff, {
  foreignKey: 'assigned_to_staff_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

// Lien -> Request initiée par un client (guest)
Guest.hasMany(MaintenanceRequest, {
  foreignKey: 'requested_by_guest_id',
  onDelete: 'SET NULL',   // Si guest supprimé : garde la demande mais met l'ID à NULL
  onUpdate: 'CASCADE'
});
MaintenanceRequest.belongsTo(Guest, {
  foreignKey: 'requested_by_guest_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

// Lien -> Room (pour localiser l’intervention)
Room.hasMany(MaintenanceRequest, {
  foreignKey: 'room_id',
  onDelete: 'SET NULL',   // Si la chambre est supprimée, on conserve la demande sans la chambre
  onUpdate: 'CASCADE'
});
MaintenanceRequest.belongsTo(Room, {
  foreignKey: 'room_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

module.exports = { MaintenanceRequest };
