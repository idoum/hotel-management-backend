const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Restaurant = sequelize.define('Restaurant', {
  restaurant_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  location: DataTypes.STRING,
  opening_hours: DataTypes.STRING
}, {
  tableName: 'Restaurant',
  timestamps: false,
});

module.exports = Restaurant;
