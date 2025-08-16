// src/modules/pool/models/poolReservation.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const PoolReservation = sequelize.define('PoolReservation', {
  pool_reservation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  heure_debut: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  heure_fin: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  guest_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  staff_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pool_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nombre_personnes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  statut: {
    type: DataTypes.ENUM('confirmée', 'annulée', 'en attente'),
    defaultValue: 'en attente',
  }
}, {
  tableName: 'PoolReservation',
  timestamps: false,
});

module.exports = PoolReservation;
