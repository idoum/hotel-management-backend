const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  item_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'OrderItem',
  timestamps: false,
});

module.exports = OrderItem;
