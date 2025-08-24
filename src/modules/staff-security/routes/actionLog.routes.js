const express = require('express');
const router = express.Router();

const actionLogController = require('../controllers/actionLog.controller');
const { validate } = require('../../../middlewares/validate');
const { logIdParam, staffIdParam } = require('../validators/actionLog.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// Route pour récupérer les audit logs
router.get('/audit-logs', actionLogController.getAuditLogs);

// GET tous les logs
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager'] }),
  actionLogController.getAllLogs
);

// GET logs par staff id
router.get(
  '/staff/:staffId',
  authenticateJWT,
  validate(staffIdParam, 'params'),
  authorize({ roles: ['admin', 'manager'] }),
  actionLogController.getLogsByStaff
);

// DELETE log
router.delete(
  '/:id',
  authenticateJWT,
  validate(logIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  actionLogController.deleteLog
);

module.exports = router;
