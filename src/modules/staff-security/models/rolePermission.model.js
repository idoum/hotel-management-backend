const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const RolePermission = sequelize.define('RolePermission', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  permission_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  tableName: 'RolePermission',
  timestamps: false,
});

module.exports = RolePermission;
