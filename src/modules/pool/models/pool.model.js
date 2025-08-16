// src/modules/pool/models/pool.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Pool = sequelize.define('Pool', {
  pool_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profondeur_max: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('intérieure', 'extérieure'),
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'Pool',
  timestamps: false,
});

module.exports = Pool;
