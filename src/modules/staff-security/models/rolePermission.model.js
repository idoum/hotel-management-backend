const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const RolePermission = sequelize.define('RolePermission', {
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Role',
      key: 'role_id'
    }
  },
  permission_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Permission',
      key: 'permission_id'
    }
  }
}, {
  tableName: 'rolepermission',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['role_id', 'permission_id']
    }
  ]
});

module.exports = RolePermission;
