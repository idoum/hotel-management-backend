// booking.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Booking = sequelize.define('Booking', {
  booking_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  guest_id: { type: DataTypes.INTEGER, allowNull: false },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  checkin_date: { type: DataTypes.DATE, allowNull: false },
  checkout_date: { type: DataTypes.DATE, allowNull: false },
  staff_id: { type: DataTypes.INTEGER, allowNull: false }, // staff-security
  total_price: { type: DataTypes.DECIMAL(10,2) }
}, {
  tableName: 'Booking',
  timestamps: false,
});

module.exports = Booking;
