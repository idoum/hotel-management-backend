// roomType.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const RoomType = sequelize.define('RoomType', {
  type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  price_per_night: DataTypes.DECIMAL(10,2),
  capacity: DataTypes.INTEGER
}, {
  tableName: 'RoomType',
  timestamps: false,
});

module.exports = RoomType;
