const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const Staff = require('./staff.model');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  staff_id: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'User',
  timestamps: false,
});

User.associate = (models) => {
  User.belongsToMany(models.Role, {
    through: models.UserRole,
    foreignKey: 'user_id',
    otherKey: 'role_id',
  });
};

module.exports = User;
