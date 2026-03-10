const express = require('express');  
const router = express.Router();  
const ctrl = require('../controllers/superAdmin.controller');  
  
router.post('/', ctrl.createSuperAdmin);  
router.get('/', ctrl.getAllSuperAdmins);  
router.get('/:id', ctrl.getSuperAdminById);  
router.post('/login', ctrl.superAdminLogin);  
  
module.exports = router; 
