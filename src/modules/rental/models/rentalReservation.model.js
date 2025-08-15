const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const RentalReservation = sequelize.define('RentalReservation', {
  reservation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rental_id: { type: DataTypes.INTEGER, allowNull: false },
  guest_id: { type: DataTypes.INTEGER, allowNull: false },
  staff_id: { type: DataTypes.INTEGER, allowNull: false },
  start_datetime: { type: DataTypes.DATE, allowNull: false },
  end_datetime: { type: DataTypes.DATE, allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  status: { type: DataTypes.ENUM('booked', 'cancelled', 'completed'), defaultValue: 'booked' }
}, {
  tableName: 'RentalReservation',
  timestamps: false,
});

module.exports = RentalReservation;
