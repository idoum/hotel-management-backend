// src/modules/staff-security/models/actionLog.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const ActionLog = sequelize.define('ActionLog', {
  log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  staff_id: {
    type: DataTypes.INTEGER,
  },
  action_type: {
    type: DataTypes.ENUM('create', 'update', 'delete', 'login', 'logout'),
    allowNull: false,
  },
  description: DataTypes.TEXT,
  action_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'ActionLog',
  timestamps: false,
});

module.exports = ActionLog;
