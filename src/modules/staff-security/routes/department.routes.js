// src/modules/staff-security/routes/department.routes.js

const express = require('express');
const router = express.Router();

const departmentController = require('../controllers/department.controller');
const { validate } = require('../../../middlewares/validate');
const { departmentSchema, departmentIdParam } = require('../validators/department.validator');

const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Department
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager'] }),
  departmentController.getAllDepartments
);

router.get(
  '/:id',
  authenticateJWT,
  validate(departmentIdParam, 'params'),
  authorize({ roles: ['admin', 'manager'] }),
  departmentController.getDepartmentById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(departmentSchema),
  departmentController.createDepartment
);

router.put(
  '/:id',
  authenticateJWT,
  validate(departmentIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(departmentSchema),
  departmentController.updateDepartment
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(departmentIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  departmentController.deleteDepartment
);

module.exports = router;
