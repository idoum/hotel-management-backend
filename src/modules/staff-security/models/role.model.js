// src/modules/staff-security/models/role.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Role = sequelize.define('Role', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: DataTypes.TEXT,
}, {
  tableName: 'Role',
  timestamps: false,
});

module.exports = Role;
