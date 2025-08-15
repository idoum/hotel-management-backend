// src/modules/staff-security/models/userRole.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const UserRole = sequelize.define('UserRole', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  tableName: 'UserRole',
  timestamps: false,
});

module.exports = UserRole;
