const RoomRental = require('./roomRental.model');
const RentalReservation = require('./rentalReservation.model');
const Guest = require('../../accommodation/models/guest.model');
const Staff = require('../../staff-security/models/staff.model');

// Une salle a plusieurs réservations
RoomRental.hasMany(RentalReservation, {
  foreignKey: 'rental_id',
  onDelete: 'RESTRICT',   // Empêche suppression si il existe des réservations
  onUpdate: 'CASCADE'
});
RentalReservation.belongsTo(RoomRental, {
  foreignKey: 'rental_id',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Chaque réservation appartient à un client
Guest.hasMany(RentalReservation, {
  foreignKey: 'guest_id',
  onDelete: 'RESTRICT',   // Empêche suppression d'un guest avec réservations
  onUpdate: 'CASCADE'
});
RentalReservation.belongsTo(Guest, {
  foreignKey: 'guest_id',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Chaque réservation appartient à un staff (personnel)
Staff.hasMany(RentalReservation, {
  foreignKey: 'staff_id',
  onDelete: 'SET NULL',  // Si staff supprimé, met staff_id à NULL (optionnel)
  onUpdate: 'CASCADE'
});
RentalReservation.belongsTo(Staff, {
  foreignKey: 'staff_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

module.exports = {
  RoomRental,
  RentalReservation
};
