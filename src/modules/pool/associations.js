// src/modules/pool/associations.js

const PoolReservation = require('./models/poolReservation.model');
const Pool = require('./models/pool.model');
const Guest = require('../accommodation/models/guest.model');
const Staff = require('../staff-security/models/staff.model');

// Association : un Client (Guest) peut avoir plusieurs réservations piscine
Guest.hasMany(PoolReservation, {
  foreignKey: 'guest_id',
  onDelete: 'CASCADE',    // Suppression d’un client supprime ses réservations
  onUpdate: 'CASCADE'
});
PoolReservation.belongsTo(Guest, {
  foreignKey: 'guest_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Association : un technicien (Staff) peut être assigné à plusieurs réservations piscina
Staff.hasMany(PoolReservation, {
  foreignKey: 'staff_id',
  onDelete: 'SET NULL',   // Suppression d’un staff met à NULL, mais ne supprime pas la réservation
  onUpdate: 'CASCADE'
});
PoolReservation.belongsTo(Staff, {
  foreignKey: 'staff_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

// Association : Une piscine (Pool) peut avoir plusieurs réservations
Pool.hasMany(PoolReservation, {
  foreignKey: 'pool_id',
  onDelete: 'SET NULL',   // Suppression d’une piscine met le pool_id à NULL dans les réservations
  onUpdate: 'CASCADE'
});
PoolReservation.belongsTo(Pool, {
  foreignKey: 'pool_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

module.exports = { PoolReservation, Pool };
