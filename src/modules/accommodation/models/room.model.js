// room.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Room = sequelize.define('Room', {
  room_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  number: { type: DataTypes.STRING, allowNull: false },
  type_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('available', 'occupied', 'maintenance', 'reserved'), defaultValue: 'available' },
  floor: DataTypes.INTEGER,
  description: DataTypes.TEXT
}, {
  tableName: 'Room',
  timestamps: false,
});

module.exports = Room;
