// src/modules/staff-security/models/staff.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Staff = sequelize.define('Staff', {
  staff_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  age: DataTypes.INTEGER,
  contact_info: DataTypes.STRING,
  salary: DataTypes.DECIMAL(10, 2),
  department_id: DataTypes.INTEGER,
}, {
  tableName: 'Staff',
  timestamps: false,
});

module.exports = Staff;
