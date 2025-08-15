const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staff.controller');
const { validate } = require('../../../middlewares/validate');
const { staffSchema, staffIdParam } = require('../validators/staff.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// GET tous les staffs
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager'] }),
  staffController.getAllStaff
);

// GET staff par id
router.get(
  '/:id',
  authenticateJWT,
  validate(staffIdParam, 'params'),
  authorize({ roles: ['admin', 'manager'] }),
  staffController.getStaffById
);

// POST créer staff
router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(staffSchema),
  staffController.createStaff
);

// PUT modifier staff
router.put(
  '/:id',
  authenticateJWT,
  validate(staffIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(staffSchema),
  staffController.updateStaff
);

// DELETE supprimer staff
router.delete(
  '/:id',
  authenticateJWT,
  validate(staffIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  staffController.deleteStaff
);

module.exports = router;
