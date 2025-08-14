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
// Dans role.model.js

Role.associate = (models) => {
  Role.belongsToMany(models.Permission, {
    through: models.RolePermission,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
  });
  Role.belongsToMany(models.User, {
    through: models.UserRole,
    foreignKey: 'role_id',
    otherKey: 'user_id',
  });
};

module.exports = Role;
