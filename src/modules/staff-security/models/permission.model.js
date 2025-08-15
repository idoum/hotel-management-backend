// src/modules/staff-security/models/permission.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Permission = sequelize.define('Permission', {
  permission_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  permission_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: DataTypes.TEXT,
}, {
  tableName: 'Permission',
  timestamps: false,
});

module.exports = Permission;
