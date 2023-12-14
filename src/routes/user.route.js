const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', userController.login);
// Temporary route for admin account creation
router.post('/create-admin', authMiddleware, userController.createAdminAccount);

module.exports = router;
