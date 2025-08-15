const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const RestaurantOrder = sequelize.define('RestaurantOrder', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  table_id: { type: DataTypes.INTEGER, allowNull: false },
  staff_id: { type: DataTypes.INTEGER, allowNull: false }, // staff-security
  guest_id: { type: DataTypes.INTEGER, allowNull: true },  // optional: link with accommodation
  order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'RestaurantOrder',
  timestamps: false,
});

module.exports = RestaurantOrder;
