// src/modules/staff-security/models/department.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Department = sequelize.define('Department', {
  department_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  head: DataTypes.STRING,
  role: DataTypes.STRING,
  staff_count: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'Department',
  timestamps: false,
});

module.exports = Department;
