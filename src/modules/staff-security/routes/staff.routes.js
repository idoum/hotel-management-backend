const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const { authenticateJWT } = require('../../middlewares/authenticate');
const { authorizeRole } = require('../../middlewares/authorize');

// Création staff-utilisateur (admin)
router.post('/', authenticateJWT, authorizeRole('admin'), staffController.createStaffUser);

// Connexion/login (pas besoin auth)
router.post('/login', staffController.login);

// Lecture staff (admin)
router.get('/', authenticateJWT, authorizeRole('admin'), staffController.getAllStaff);

module.exports = router;
