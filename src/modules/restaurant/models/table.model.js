const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const RestaurantTable = sequelize.define('RestaurantTable', {
  table_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
  name: DataTypes.STRING,
  seats: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM('available', 'reserved', 'occupied', 'maintenance'),
    defaultValue: 'available',
  }
}, {
  tableName: 'RestaurantTable',
  timestamps: false,
});

module.exports = RestaurantTable;
