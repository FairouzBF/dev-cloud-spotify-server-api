//user.route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', userController.login);
router.post('/logout', authMiddleware, userController.logout);
router.post('/create-admin', userController.createAdminAccount);
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
