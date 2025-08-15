const RoomType = require('./roomType.model');
const Room = require('./room.model');
const Guest = require('./guest.model');
const Booking = require('./booking.model');
const Payment = require('./payment.model');

// Import des modèles staff-security
const Staff = require('../../staff-security/models/staff.model');
const ActionLog = require('../../staff-security/models/actionLog.model');

// Room - RoomType
Room.belongsTo(RoomType, { foreignKey: 'type_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
RoomType.hasMany(Room, { foreignKey: 'type_id' });

// Booking - Room
Booking.belongsTo(Room, { foreignKey: 'room_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Room.hasMany(Booking, { foreignKey: 'room_id' });

// Booking - Guest
Booking.belongsTo(Guest, { foreignKey: 'guest_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Guest.hasMany(Booking, { foreignKey: 'guest_id' });

// Booking - Staff (staff ayant créé/renseigné la réservation)
Booking.belongsTo(Staff, { foreignKey: 'staff_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Staff.hasMany(Booking, { foreignKey: 'staff_id' });

// Payment - Booking
Payment.belongsTo(Booking, { foreignKey: 'booking_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Booking.hasMany(Payment, { foreignKey: 'booking_id' });

// Payment - Staff (staff ayant validé le paiement)
Payment.belongsTo(Staff, { foreignKey: 'staff_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Staff.hasMany(Payment, { foreignKey: 'staff_id' });

// Optionnel : action de réservation (journalisation)
ActionLog.belongsTo(Staff, { foreignKey: 'staff_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

module.exports = { 
  RoomType,
  Room,
  Guest,
  Booking,
  Payment
};
