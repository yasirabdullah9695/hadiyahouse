const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  logout,
  register,
  changePassword,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

// Public
router.post('/login', login);
router.post('/logout', logout);

// Protected
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

// Admin only — naye user/admin banana
router.post('/register', protect, adminOnly, register);

module.exports = router;
