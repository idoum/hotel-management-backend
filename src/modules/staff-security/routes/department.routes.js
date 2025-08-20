const express = require('express');
const router = express.Router();

const departmentController = require('../controllers/department.controller');
const { validate } = require('../../../middlewares/validate');
const { departmentSchema, departmentIdParam } = require('../validators/department.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// GET tous les départements
router.get(
  '/',
  //authenticateJWT,
  //authorize({ roles: ['admin', 'manager'] }),
  departmentController.getAllDepartments
);

// GET département par id
router.get(
  '/:id',
  //authenticateJWT,
  validate(departmentIdParam, 'params'),
  //authorize({ roles: ['admin', 'manager'] }),
  departmentController.getDepartmentById
);

// POST créer département
router.post(
  '/',
  //authenticateJWT,
  //authorize({ roles: ['admin'] }),
  validate(departmentSchema),
  departmentController.createDepartment
);

// PUT modifier département
router.put(
  '/:id',
  //authenticateJWT,
  validate(departmentIdParam, 'params'),
  //authorize({ roles: ['admin'] }),
  validate(departmentSchema),
  departmentController.updateDepartment
);

// DELETE supprimer département
router.delete(
  '/:id',
  //authenticateJWT,
  validate(departmentIdParam, 'params'),
  //authorize({ roles: ['admin'] }),
  departmentController.deleteDepartment
);

module.exports = router;
