// guest.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Guest = sequelize.define('Guest', {
  guest_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  dob: DataTypes.DATE,
  address: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING
}, {
  tableName: 'Guest',
  timestamps: false,
});

module.exports = Guest;
