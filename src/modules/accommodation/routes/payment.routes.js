// src/modules/accommodation/routes/payment.routes.js

const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller');
const { validate } = require('../../../middlewares/validate');
const { paymentSchema, paymentIdParam } = require('../validators/payment.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Payment
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  paymentController.getAllPayments
);

router.get(
  '/:id',
  authenticateJWT,
  validate(paymentIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  paymentController.getPaymentById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'staff'] }),
  validate(paymentSchema),
  paymentController.createPayment
);

router.put(
  '/:id',
  authenticateJWT,
  validate(paymentIdParam, 'params'),
  authorize({ roles: ['admin', 'staff'] }),
  validate(paymentSchema),
  paymentController.updatePayment
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(paymentIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  paymentController.deletePayment
);

module.exports = router;
