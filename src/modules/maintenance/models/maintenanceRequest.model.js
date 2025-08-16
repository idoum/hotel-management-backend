// src/modules/maintenance/models/maintenanceRequest.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre: { type: DataTypes.STRING, allowNull: false },      // "Robinet cassé"
  description: { type: DataTypes.TEXT, allowNull: false },
  statut: {
    type: DataTypes.ENUM('en attente', 'en cours', 'résolue', 'annulée'),
    defaultValue: 'en attente'
  },
  priorité: { type: DataTypes.ENUM('faible', 'normale', 'élevée'), defaultValue: 'normale' },
  demandeur_client_id: { type: DataTypes.INTEGER, allowNull: true },   // Peut être null si staff directement
  assigné_technicien_id: { type: DataTypes.INTEGER, allowNull: true },
  chambre_id: { type: DataTypes.INTEGER, allowNull: true },    // Peut être null si hors chambre
  créée_le: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  modifiée_le: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'MaintenanceRequest',
  timestamps: false,
});

module.exports = MaintenanceRequest;
