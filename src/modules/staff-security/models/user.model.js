// src/modules/staff-security/models/user.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  staff_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'User',
  timestamps: false,
});

module.exports = User;
