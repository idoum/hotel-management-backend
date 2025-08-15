// payment.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  booking_id: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  method: { type: DataTypes.ENUM('cash', 'card', 'transfer'), allowNull: false },
  payment_date: { type: DataTypes.DATE, allowNull: false },
  staff_id: { type: DataTypes.INTEGER, allowNull: false } // staff-security
}, {
  tableName: 'Payment',
  timestamps: false,
});

module.exports = Payment;
