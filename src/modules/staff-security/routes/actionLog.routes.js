// src/modules/staff-security/routes/actionLog.routes.js

const express = require('express');
const router = express.Router();

const actionLogController = require('../controllers/actionLog.controller');
const { validate } = require('../../../middlewares/validate');
const { logIdParam, staffIdParam } = require('../validators/actionLog.validator');

const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// Logs
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager'] }),
  actionLogController.getAllLogs
);

router.get(
  '/staff/:staffId',
  authenticateJWT,
  validate(staffIdParam, 'params'),
  authorize({ roles: ['admin', 'manager'] }),
  actionLogController.getLogsByStaff
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(logIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  actionLogController.deleteLog
);

module.exports = router;
