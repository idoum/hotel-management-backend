const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const RoomRental = sequelize.define('RoomRental', {
  rental_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room_name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  location: DataTypes.STRING,
  price_per_hour: { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, {
  tableName: 'RoomRental',
  timestamps: false,
});

module.exports = RoomRental;
