const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const Staff = require('./staff.model');

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

ActionLog.belongsTo(Staff, { foreignKey: 'staff_id' });

module.exports = ActionLog;
