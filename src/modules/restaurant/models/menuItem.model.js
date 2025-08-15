const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const MenuItem = sequelize.define('MenuItem', {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  category: DataTypes.STRING
}, {
  tableName: 'MenuItem',
  timestamps: false,
});

module.exports = MenuItem;
