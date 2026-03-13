const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/superAdmin.controller');

router.post('/', ctrl.createSuperAdmin);
router.get('/', ctrl.getAllSuperAdmins);
router.get('/:id', ctrl.getSuperAdminById);
router.post('/login', ctrl.superAdminLogin);

// Password Management
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);
router.put('/update-password', ctrl.updatePassword);

// Get Employees under SuperAdmin
router.get('/:superAdminId/employees', ctrl.getEmployeesUnderSuperAdmin);

module.exports = router;
