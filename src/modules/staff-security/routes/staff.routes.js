const express = require("express");
const router = express.Router();

const staffController = require("../controllers/staff.controller");
const { validate } = require("../../../middlewares/validate");
const { staffSchema, staffIdParam } = require("../validators/staff.validator");
const { authenticateJWT } = require("../../../middlewares/authenticate");
const { authorize } = require("../../../middlewares/authorize");

// GET statistiques des employés
router.get(
  "/stats",
  // authenticateJWT,
  // authorize({ roles: ['admin'] }),
  staffController.getStaffStats
);

// GET tous les employés (avec filtres optionnels)
router.get(
  "/",
  // authenticateJWT,
  // authorize({ roles: ['admin', 'manager'] }),
  staffController.getAllStaff
);

// GET employé par id
router.get(
  "/:id",
  // authenticateJWT,
  // validate(staffIdParam, "params"),
  // authorize({ roles: ["admin", "manager"] }),
  staffController.getStaffById
);

// POST créer employé
router.post(
  "/",
  // authenticateJWT,
  // authorize({ roles: ['admin'] }),
  // validate(staffSchema),
  staffController.createStaff
);

// PUT modifier employé
router.put(
  "/:id",
  // authenticateJWT,
  // validate(staffIdParam, "params"),
  // authorize({ roles: ['admin'] }),
  // validate(staffSchema),
  staffController.updateStaff
);

// DELETE supprimer employé
router.delete(
  "/:id",
  // authenticateJWT,
  // validate(staffIdParam, "params"),
  // authorize({ roles: ["admin"] }),
  staffController.deleteStaff
);

// GET vérifier si peut supprimer
router.get(
  "/:id/can-delete",
  // authenticateJWT,
  staffController.canDeleteStaff
);

// PATCH changer statut actif/inactif
router.patch(
  "/:id/status",
  // authenticateJWT,
  // authorize({ roles: ['admin'] }),
  staffController.toggleStaffStatus
);

module.exports = router;
