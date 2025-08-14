const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const User = require('./user.model');
const Role = require('./role.model');

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

// Associations
UserRole.belongsTo(User, { foreignKey: 'user_id' });
UserRole.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = UserRole;
